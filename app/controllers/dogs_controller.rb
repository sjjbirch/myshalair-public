class DogsController < ApplicationController
  before_action :set_dog, only: [:show, :update, :destroy, :parent_adder, :pedigree]

  def uri_adder(dog)
    # receives a dog, returns the dog with the url for its profile picture
    if dog.main_image.present?
      dog.as_json.merge({ main_image: url_for(dog.main_image) })
    else
      return dog.as_json.merge({ main_image: nil })
    end
  end

  def parent_adder_base(input, dog)
    # receives:
    # input = a hash of dog attributes
    # dog = an instantiated dog object
    # returns:
    # input with the parents attached
    # called by:
    # parent_adder_rec, pedigree
    input["sire"] = dog.litter.sire.attributes
    input["bitch"] = dog.litter.bitch.attributes
  end

  def orphan_adder_base(input)
    # receives:
    # input = a hash of dog attributes
    # returns:
    # input with the parents attached, listed as "unrecorded"
    # called by:
    # parent_adder_rec, pedigree
    input["sire"] = {"id" => "unrecorded"}
    input["bitch"] = {"id" => "unrecorded"}
  end

  def parent_adder_rec(input, recursions)
    # receives input which is either a dog or a string and the number of generations back it will build the family tree
    # appends the sire and bitch of input and then the sires and bitches of those sires and bitches back recursion number of generations
    # output is rendered family tree in json

    if input["id"].is_a?(Integer)
      dog = Dog.find(input["id"])
      if dog.litter.present?
        parent_adder_base(input, dog)
      else
        orphan_adder_base(input)
      end
    elsif input["id"].is_a?(String)
      orphan_adder_base(input)
    else
      puts "If you see this in server logs, I let something silently fail."
    end

    if recursions > 0
      recursions -= 1
      parent_adder_rec(input["sire"], recursions)
      parent_adder_rec(input["bitch"], recursions)
    end
  end

  def pedigree
    # called by /pedigree
    # expects a dog ID in params and a number of generations
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
      #}
    # }
    # etc for the number of generations requested

    dogattribs = @dog.attributes
    generations = params[:generations]

    if @dog.litter.present?
      parent_adder_base(dogattribs, @dog)
    else
      orphan_adder_base(dogattribs)
    end

    parent_adder_rec(dogattribs, generations-1) if generations > 1

    render json: {"dog": dogattribs }

  end

  def reorder_position
    # receives list of dogs as dog_ids and new position, updates the DB with them
    # requires refactor: n+1 query problem

    dogs = params[:dogs]
    numbertomove = dogs.count

    dogs.each do |dog|
      @d = Dog.find(dog[:id])
      unless @d.position == dog[:position]
        if @d.insert_at(dog[:position])
            numbertomove -= 1
        end
      else
        numbertomove -= 1
      end
    end

    @dogz = Dog.all

    if numbertomove == 0
      render json: { success: "Success", message: "Dog positions updated", dogs: @dogz }, status: 201
    else
      render json: { success: "Failure", message: "Dog positions not updated" }, status: :unprocessable_entity
    end
  end

  def boys
    @dogs = Dog.males.map { |dog| uri_adder(dog) }
  
    render json: @dogs
  end  
  
  def girls
    @dogs = Dog.females.map { |dog| uri_adder(dog) }

    render json: @dogs
  end

  def puppies
    @dogs = Dog.puppers.map { |dog| uri_adder(dog) }

    render json: @dogs
  end

  # GET /dogs
  def index
    @dogs = Dog.all.map { |dog| uri_adder(dog) }

    render json: @dogs
  end

  # GET /dogs/1
  def show

    if @dog.sex == 1
      puts "it's a boy"
      #@dog = @dog.add each of its sired litters
    else
      puts "it's a girl"
      #@dog = @dog.add its bitched_litters
    end

    # puts @dog.litter
    # puts @dog.litter.breeder

    @dog = uri_adder(@dog)

    render json: @dog
  end

  # POST /dogs
  def create
    @dog = Dog.new(dog_params, position: 5)

    if @dog.save
      render json: @dog, status: :created, location: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /dogs/1
  def update
    if @dog.update(dog_params)
      render json: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end
  end

  # DELETE /dogs/1
  def destroy
    @dog.destroy
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
                                :main_image, :litter_id, :position,
                                :dlist, :generations)
  end
end
