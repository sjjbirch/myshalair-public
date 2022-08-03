class DogsController < ApplicationController
  before_action :set_dog, only: [:show, :update, :destroy]

  def uri_adder(dog)
    if dog.main_image.present?
      dog.as_json.merge({ main_image: url_for(dog.main_image) })
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
    @dog = Dog.new(dog_params)

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

  # Only allow a list of trusted parameters through.
  def dog_params
    params.require(:dog).permit(:callname, :realname, :dob, :sex,
                                :ownername, :breedername, :breeder,
                                :sired_litters, :bitched_litters,
                                :main_image)
  end
end
