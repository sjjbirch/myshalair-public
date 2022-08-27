class DogsController < ApplicationController
  before_action :set_dog, only: %i[show update destroy parent_adder healthtest_editor main_image_adder]
  before_action :admin_check, only: %i[
    update destroy create find_dog_by_chipnumber lazy_dog_create
  ]


 # custom routes
  def reorder_position
    # Inputs:
    #   list of dogs as dog_ids and new position
    # Outputs:
    #   Updates the DB with new positions, returns new positions or failure as json.
    # called by:
    #   nil
    # Dependencies:
    #   gem acts_as_list
    # Known issues:
    #   The gem is really inefficient with db calls
    #   requires refactor: n+1 query problem
    # Feature supported:
    #   Admin customising ordering of dogs

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

    # Inputs:
    #   dog with nested lists of dependents in params
    # Outputs:
    #   Creates dog and all dependents in one swoop
    #   Returns JSON of dog and messages depending on what happened with the dependents
    # called by:
    #   routes
    # Dependencies:
    #   activerecord, uri_adder, lazy_litter_adder, lazy_healthtest_add, main_image_updater
    # Feature supported:
    #   Admin addition of new dogs


    littermess = 'asdsadsad'
    healthtestmess = 'asdsa'
    mainimagemess = 'astring'

    @dog = Dog.create(dog_params)

    params[:dog][:litter].present? ? lazy_litter_adder && littermess = "Added to litter #{params[:dog][:litter][:litter_id]}" : littermess = 'No litter provided.'
    params[:dog][:healthtest].present? ? lazy_healthtest_add && healthtestmess = 'Added healthtest' : healthtestmess = 'No healthtest provided.'
    params[:mainimage].present? ? main_image_updater && mainimagemess = 'Added main image' : mainimagemess = 'No main image provided.'

    @dog.uri_adder

    if @dog.id.present?
      render json: { dog: @dog, litter: littermess, healthtest: healthtestmess, mainimage: mainimagemess }, status: :created, location: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end
  end

  def lazy_litter_adder
    # Inputs:
    #   dog with nested litter object in params
    # Outputs:
    #   db write join between a dog and litter
    #   dog's dob updated to the date of the litter if it exists
    #   Returns to calling function
    # called by:
    #   lazy_dog_create
    # Dependencies:
    #   nil
    # Feature supported:
    #   Admin addition of new dogs
    puppylist = params[:dog][:litter]
    PuppyList.create(litter_id: puppylist[:litter_id], dog_id: @dog.id)
    @dog.update(dob: Litter.find(puppylist[:litter_id]).adate) if Litter.find(puppylist[:litter_id]).adate.present?
  end

  def lazy_litter_updater
    # context aware version of lazy_litter_adder
    # Inputs:
    #   dog with nested litter object in params
    # Outputs:
    #   updated db write join between a dog and litter if one already existed
    #   created etc if one didn't exist
    #   dog's dob updated to the date of the litter if it exists
    #   Returns to calling function
    # called by:
    #   update
    # Dependencies:
    #   nil
    # Feature supported:
    #   Admin editing of dogs
    litter = params[:dog][:litter]
    @puppylist = PuppyList.where(dog_id: params[:id])
    if @puppylist.empty?
      PuppyList.create(litter_id: litter[:litter_id], dog_id: @dog.id)
    else
      @puppylist.update(litter_id: litter[:litter_id], dog_id: @dog.id)
    end
    @dog.update(dob: Litter.find(litter[:litter_id]).adate) if Litter.find(litter[:litter_id]).adate.present?
  end

  def lazy_healthtest_add
    # 
    # Inputs:
    #   dog with nested healthtest object in params
    # Outputs:
    #   updated db write join between a dog and litter
    #   Returns to true or false to calling function to signal if it succeeded (but unused)
    # called by:
    #   update lazy_dog_create
    # Dependencies:
    #   nil
    # Feature supported:
    #   Admin add and edit of dogs
    # known issues:
    #   known silent fail: else can't be triggered even if you give strings etc
    #   problem for healthtest_editor, not for lazy dog creator
    healthtest = params[:dog][:healthtest]
    if @dog.healthtest.update(
      pra: healthtest[:pra], fn: healthtest[:fn],
      aon: healthtest[:aon], ams: healthtest[:ams],
      bss: healthtest[:bss]
    )
      true
    else
      false
    end

  end

  # def healthtest_editor
  #   #  Deprecated function. Left here just in case I'm wrong and it's not deprecated.
  #   if lazy_healthtest_add
  #     render json: { success: 'Success', message: "Updated dog's healthtest", healthtest: @dog.healthtest }, status: 201
  #   else
  #     render json: { success: 'Failure', message: "Updated dog's healthtest", healthtest: @dog.errors },
  #            status: :unprocessable_entity
  #   end
  # end

  # prescoped endpoints
  def boys
    @dogs = Dog.males.displayed.map { |dog| dog.plebifier }
  end

  def girls
    @dogs = Dog.females.displayed.map { |dog| dog.plebifier }
    render json: @dogs
  end

  def puppies
    @dogs = Dog.puppers.displayed.map { |dog| dog.plebifier }
    render json: @dogs
  end

  # special adders
  def main_image_updater
    # 
    # Inputs:
    #   a dog object called @dog with a main_image provided
    # Outputs:
    #   a main image in activestorage
    #   will delete the old one if it existed first
    # called by:
    #   create update lazy_dog_create
    # Dependencies:
    #   activestorage
    # Feature supported:
    #   Admin add and edit of dogs, showing of dogs

    @dog.main_image.purge if @dog.main_image.attached?
    @dog.main_image.attach(params[:main_image])
  end

  def gallery_image_updater
    # Inputs:
    #   a dog object called @dog with an array of gallery_images provided
    # Outputs:
    #   gallery_images in active storage
    # called by:
    #   update
    # Dependencies:
    #   activestorage
    # Feature supported:
    #   Admin edit of dogs, showing of dogs
    @dog.gallery_images.attach(params[:gallery_images])
  end

  # GET /dogs
  def index
    # An index function with its own authentication
    if current_user.nil? or !current_user.admin?
      plebdex
    else
      admindex
    end
  end

  def admindex
    # index function that provides the whole dogs
    @dogs = Dog.all.map { |dog| dog.uri_adder }
    render json: @dogs
  end

  def plebdex
    # index function that censors information from dogs
    @dogs = Dog.all.map { |dog| dog.plebifier }
    render json: @dogs
  end

  # front mutable endpoints
  def find_dog_by_chipnumber
    # Inputs:
    #   wants a chipnumber in params
    # Outputs:
    #   the dog if the dog exists, else errors all as json render
    # called by:
    #   routes
    # Dependencies:
    #   nil
    # Feature supported:
    #   Admin search for dogs by chipnumber
    # known issue:
    #    refactor to avoid loading the dog twice from db
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

    # Inputs:
    #   a dog object @dog
    # Outputs:
    #   as JSON:
    #   the dog object itself
    #   all of the pictures and the mainpicture attached to the dog
    #   a healthtest
    #   a pedigree that links to the parents and links to own litter
    #   links to each of the sired/bitched litters
    #   links to show results -- down the track
    # called by:
    #   routes find_dog_by_chipnumber
    # Dependencies:
    #   nil
    # Feature supported:
    #   Admin search for dogs by chipnumber
    # known issue:
    #    inefficient, should mostly be model methods
    #    should render: the breedername if present else dog.litter.breeder.username else "Unrecorded"

    dog_images = []
    if @dog.gallery_images.present?
      # put them in the hash
      @dog.gallery_images.each do |image|
        dog_images << url_for(image)
      end
    end

    if @dog.sex == 1
      litters = @dog.sired_litters.map { |litter| litter.main_image_adder }
    else
      litters = @dog.bitched_litters.map { |litter| litter.main_image_adder }
    end
    litters = nil if litters.length.zero?

    healthtest = @dog.healthtest
    litter = @dog.litter

    if current_user.nil? or !current_user.admin?
      @dog = @dog.plebifier
      @owner = "Not authorised."
    else
      @owner = User.find(@dog.owner_id)
      @dog = @dog.uri_adder
    end
    # add function here to modify the breedername depending on presence or absence
    # to dog.litter.breeder.username if absent

    render json: {
      dog: @dog,
      gallery_images: dog_images,
      healthtest: healthtest,
      litter: litter,
      pedigree: pedigree(@dog, 3),
      litters: litters,
      show_results: 'Sadly, unimplemented.',
      owner_details: @owner
    }
  end

  # POST /dogs
  def create
    # yo it creates a dog and uploads an image if you attached one
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
    # default rails update with conditional stuff to add dependents too

    if @dog.update(dog_params)
      lazy_healthtest_add if params[:dog][:healthtest].present?
      lazy_litter_updater if params[:dog][:litter].present?
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
    # not called anywhere
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
                                :healthtest, :display,
                                :main_image, :gallery_images => [],
                                healthtest_attributes: [:pra, :fn, :ams, :bss, :aon])
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