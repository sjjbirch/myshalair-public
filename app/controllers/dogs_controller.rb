class DogsController < ApplicationController
  before_action :set_dog, only: [:show, :update, :destroy, :parent_adder, :parent_adder1, :parent_adder_based]

  def uri_adder(dog)
    # also requires refactor - causes n queries instead of getting when it gets the main dog object
    if dog.main_image.present?
      dog.as_json.merge({ main_image: url_for(dog.main_image) })
    else
      return dog.as_json.merge({ main_image: nil })
    end
  end

  def parent_adder_base(input, recursions)

    if input["id"].is_a?(Integer)
      dog = Dog.find(input["id"])
      if dog.litter.present?
        # puts "has a litter"
        input["sire"] = dog.litter.sire.attributes
        input["bitch"] = dog.litter.bitch.attributes
      else
        # puts "no litter"
        input["sire"] = {"id" => "unrecorded"}
        input["bitch"] = {"id" => "unrecorded"}
      end
    elsif input["id"].is_a?(String)
      input["sire"] = {"id" => "unrecorded"}
      input["bitch"] = {"id" => "unrecorded"}
    else
      # some kind of rescue condition
    end

    if recursions > 0
      recursions -= 1
      parent_adder_base(input["sire"], recursions)
      parent_adder_base(input["bitch"], recursions)
    end
  end

  def pedigree
    dogattribs = @dog.attributes
    generations = params[:generations]

    if @dog.litter.present?
      dogattribs["sire"] = @dog.litter.sire.attributes
      dogattribs["bitch"] = @dog.litter.bitch.attributes
      # recursions -= 1
    else
      dogattrbis["sire"] = {"id" => "unrecorded"}
      dogattribs["bitch"] = {"id" => "unrecorded"}
      # recursions -= 1
    end

    if generations == 1
    else
      parent_adder_base(dogattribs, generations-1)
    end

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

  def add_p_to_l
    #broken don't use it
    puts dog_params

    @dog = Dog.new(dog_params)

    if @dog.save
      render json: @dog, status: :created, location: @dog
    else
      render json: @dog.errors, status: :unprocessable_entity
    end

    # PuppyList.create!(litter: request.body.read.litter_id, dog: @dog)
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
