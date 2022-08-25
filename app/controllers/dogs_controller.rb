class DogsController < ApplicationController
  before_action :set_dog, only: %i[show update destroy parent_adder healthtest_editor main_image_adder]
  before_action :admin_check, only: %i[
    update destroy create find_dog_by_chipnumber lazy_dog_create
  ]


 # custom routes

  def reorder_position
    # receives list of dogs as dog_ids and new position, updates the DB with them
    # requires refactor: n+1 query problem

    dogs = params[:dogs]
    numbertomove = dogs.count

    dogs.each do |dog|
      @d = Dog.find(dog[:id])
      if @d.position == dog[:position]
        numbertomove -= 1
      elsif @d.insert_at(dog[:position])
        numbertomove -= 1
      end
    end

    @dogz = Dog.all

    if numbertomove == 0
      render json: { success: 'Success', message: 'Dog positions updated', dogs: @dogz }, status: 201
    else
      render json: { success: 'Failure', message: 'Dog positions not updated' }, status: :unprocessable_entity
    end
  end

  def lazy_dog_create
    littermess = 'asdsadsad'
    healthtestmess = 'asdsa'
    mainimagemess = 'astring'

    @dog = Dog.create(dog_params)

    params[:litter_id].present? ? lazy_litter_adder && littermess = "Added to litter #{params[:litter_id]}" : littermess = 'No litter provided.'

    params[:healthtest].present? ? lazy_healthtest_add && healthtestmess = 'Added healthtest' : healthtestmess = 'No healthtest provided.'
    
    params[:mainimage].present? ? main_image_updater && mainimagemess = 'Added main image' : mainimagemess = 'No main image provided.'

    @dog.uri_adder

    if @dog.id.present?
      render json: { dog: @dog, litter: littermess, healthtest: healthtestmess, mainimage: mainimagemess }, status: :created, location: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end
  end

  def lazy_litter_adder
    PuppyList.create(litter_id: params[:litter_id], dog_id: @dog.id)
    @dog.update(dob: Litter.find(params[:litter_id]).adate) if Litter.find(params[:litter_id]).adate.present?
  end

  def lazy_healthtest_add
    healthtest = params[:healthtest]
    if @dog.healthtest.update(
      pra: healthtest[:pra], fn: healthtest[:fn],
      aon: healthtest[:aon], ams: healthtest[:ams],
      bss: healthtest[:bss]
    )
      true
    else
      false
    end
    # known silent fail: else can't be triggered even if you give strings etc
    # problem for healthtest_editor, not for lazy dog creator
  end

  def healthtest_editor
    if lazy_healthtest_add
      render json: { success: 'Success', message: "Updated dog's healthtest", healthtest: @dog.healthtest }, status: 201
    else
      render json: { success: 'Failure', message: "Updated dog's healthtest", healthtest: @dog.errors },
             status: :unprocessable_entity
    end
  end

  # prescoped endpoints
  # currently allow bypass of auth
  # once diplay field is added, chain displayed scope to method to fix
  def boys
    @dogs = Dog.males.displayed.map { |dog| dog.uri_adder }
    render json: @dogs
  end

  def girls
    @dogs = Dog.females.displayed.map { |dog| dog.uri_adder }
    render json: @dogs
  end

  def puppies
    @dogs = Dog.puppers.displayed.map { |dog| dog.uri_adder }
    render json: @dogs
  end

  # special adders
  def main_image_updater
    @dog.main_image.purge if @dog.main_image.attached?
    @dog.main_image.attach(params[:main_image])
  end

  def gallery_image_updater
    @dog.gallery_images.attach(params[:gallery_images])
  end

  # GET /dogs
  def index
    if current_user.nil? or !current_user.admin?
      plebdex
    else
      admindex
    end
  end

  def admindex
    @dogs = Dog.all.map { |dog| dog.uri_adder }
    render json: @dogs
  end

  def plebdex
    @dogs = Dog.all.map { |dog| dog.plebifier }
    render json: @dogs
  end

  # front mutable endpoints
  def find_dog_by_chipnumber
    # refactor to avoid loading the dog twice from db
    if params[:chipnumber].present? && params[:chipnumber].length == 15
      @dog = Dog.where(chipnumber: params[:chipnumber]).first
      if @dog
        params[:id] = @dog.id
        show
      else
        render json: { success: 'Success', message: "No dog with the microchip number #{params[:chipnumber]} found" }, status: 404
      end
    else
      render json: { success: 'Failure', message: "Must provide a microchip number" }, status: 422
    end
  end

   # GET /dogs/1
  def show
    #called by dogs#show, dogs#find_dog_by_chipnumber


    # renders dogs and the kitchen sink associated with them:
    # the dog object itself
    # all of the pictures and the mainpicture attached to the dog
    # a healthtest
    # a pedigree that links to the parents and links to own litter
    # links to each of the sired/bitched litters
    # links to show results -- down the track
    # the breedername if present else dog.litter.breeder.username else "Unrecorded"

    dog_images = Hash.new
    if @dog.gallery_images.present?
      # put them in the hash
      @dog.gallery_images.each_with_index do |image, index|
        dog_images[index] = url_for(image)
      end
    end

    if @dog.sex == 1
      litters = @dog.sired_litters
    else
      litters = @dog.bitched_litters
      litters = nil if litters.length.zero?
    end

    healthtest = @dog.healthtest
    litter = @dog.litter

    @dog = @dog.plebifier
    # add function here to modify the breedername depending on presence or absence
    # to dog.litter.breeder.username if absent

    render json: {
      dog: @dog,
      gallery_images: dog_images,
      healthtest: healthtest,
      litter: litter,
      pedigree: pedigree(@dog, 3),
      litters: litters,
      show_results: 'Sadly, unimplemented.'
    }
  end

  # POST /dogs
  def create
    @dog = Dog.new(dog_params)

    if @dog.save
      main_image_updater if params[:main_image].present?
      @dog.uri_adder
      render json: @dog, status: :created, location: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end
  end


  # PATCH/PUT /dogs/1
  def update

    if @dog.update(dog_params)
      main_image_updater if params[:main_image].present?
      gallery_image_updater if params[:gallery_images].present?
      @dog.uri_adder
      render json: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end
  end

  # DELETE /dogs/1
  def destroy
    @dog.destroy
  end

  # controller actions that should be helper or model methods

  def pedigree(dog, generations)
    # called by /pedigree
    # expects a dog and a number of generations
    # builds the first generation (the input dog with its sire and bitch)
    # if the requested number of generations is > 1
    # then it calls the recursive parent adder function to build generations past 1
    # returns the pedigree of the dog in JSON with the form:
    # {
    # dog: {
    # dog k and v
    # sire: {
    # id: id,
    # sire:{},
    # bitch: {}
    # },
    # bitch: {
    # id: id,
    # sire: {},
    # bitch: {}
    # }
    # }
    # }
    # etc for the number of generations requested

    @dog = Dog.find(dog['id'])
    dogattribs = dog

    if @dog.litter.present?
      parent_adder_base(dogattribs, @dog)
    else
      orphan_adder_base(dogattribs)
    end

    parent_adder_rec(dogattribs, generations - 1) if generations > 1

    # render json: { "dog": dogattribs }
  end

  def parent_adder_base(input, dog)
    # receives:
    # input = a hash of dog attributes
    # dog = an instantiated dog object
    # returns:
    # input with the parents attached
    # called by:
    # parent_adder_rec, pedigree
    input['sire'] = dog.litter.sire.attributes
    input['bitch'] = dog.litter.bitch.attributes
  end

  def orphan_adder_base(input)
    # receives:
    # input = a hash of dog attributes
    # returns:
    # input with the parents attached, listed as "unrecorded"
    # called by:
    # parent_adder_rec, pedigree
    input['sire'] = { 'id' => 'unrecorded' }
    input['bitch'] = { 'id' => 'unrecorded' }
  end

  def parent_adder_rec(input, recursions)
    # receives input which is either a dog or a string and the number of generations back it will build the family tree
    # appends the sire and bitch of input and then the sires and bitches of those sires and bitches back recursion number of generations
    # output is rendered family tree in json

    if input['id'].is_a?(Integer)
      dog = Dog.find(input['id'])
      if dog.litter.present?
        parent_adder_base(input, dog)
      else
        orphan_adder_base(input)
      end
    elsif input['id'].is_a?(String)
      orphan_adder_base(input)
    else
      puts 'If you see this in server logs, I let something silently fail.'
    end

    if recursions > 0
      recursions -= 1
      parent_adder_rec(input['sire'], recursions)
      parent_adder_rec(input['bitch'], recursions)
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_dog
    @dog = Dog.find(params[:id])
  end

  # def init_position
  # unused function for manually initing the display position of a dog intended for call at before_create if used
  #   self.position ||= self.id
  # end

  # Only allow a list of trusted parameters through.
  def dog_params
    params.require(:dog).permit(:callname, :realname, :dob, :sex,
                                :ownername, :breedername, :breeder,
                                :sired_litters, :bitched_litters,
                                :litter_id, :position,
                                :dlist, :generations, :retired,
                                :description, :colour, :chipnumber,
                                :main_image, :gallery_images => [])
  end
end

# Archived functions

  # def uri_adder(dog)
  # replaced with equivalent model function. Left only for reference.
  #   # receives a dog, returns the dog with the url for its profile picture
  #   if dog.main_image.present?
  #     dog.as_json.merge({ main_image: url_for(dog.main_image) })
  #   else
  #     dog.as_json.merge({ main_image: nil })
  #   end
  # end