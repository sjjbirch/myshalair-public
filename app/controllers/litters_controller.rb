class LittersController < ApplicationController
  before_action :set_litter, only: %i[ show update destroy add_puppy add_puppies ]

# custom helpers

  def puppy_getter(litter,output)
    if litter.dogs.exists?
      puppies = []
      litter.dogs.each do |puppy|
        puppies << puppy
      end
      output.as_json.merge({ puppies: puppies })
    else
      output.as_json.merge({ puppies: nil })
    end
  end

  def litter_applications_getter(litter,output)
    if litter.litter_applications.exists?
      litter_applications = []
      litter.litter_applications.each do |app|
        litter_applications << app
      end
      output.as_json.merge({ litterApplications: litter_applications })
    else
      output.as_json.merge({ litterApplications: nil })
    end
  end

  #custom route actions

  def add_puppy
    @doggo = @litter.dogs.build( callname: params[:callname], realname: params[:realname], 
                                 dob: @litter.adate, sex: params[:sex] )
    if @doggo.save
      render json: { success: "Success", message: "#{params[:callname]} created", dog: @doggo }, status: 201
    else
      render json: { success: "Failure", message: "#{params[:callname]} not created", errors: @litter.errors }, status: :unprocessable_entity
    end
  end

  def add_puppies
    if params[:dogs].count != 0
      @dogs = params[:dogs]
      errinos = []
      createddogs = []

    else
      render json: { success: "Failure", message: "No puppies sent in update" }, status: :unprocessable_entity
      return
    end

    @dogs.each do |dog|
      @dog = @litter.dogs.build( callname: dog[:callname], realname: dog[:realname], 
      dob: @litter.adate, sex: dog[:sex] )
      if @dog.save
        createddogs << @dog
      else
        @dog.errors << errinos
      end
    end
    
    if createddogs.count == @dogs.count
       render json: { success: "Success", message: "Puppies attached", dogs: createddogs }, status: 201
    else
      render json: { success: "Failure", message: "At least some puppies not created", dogs: createddogs, errors: errinos }, status: :unprocessable_entity
    end

  end

  # GET /litters
  def index
    @litters = Litter.all

    render json: @litters
  end

  # GET /litters/1
  def show
    @output = @litter
    @output = puppy_getter(@litter, @output)
    @output = litter_applications_getter(@litter, @output)
    render json: @output
  end

  # POST /litters
  def create
    @litter = Litter.new(litter_params)

    if @litter.save
      render json: @litter, status: :created, location: @litter
    else
      render json: @litter.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /litters/1
  def update
    # if puppies are attached, then update their dob if adate is changed or added
    changeddogs = []

    if params.has_key?(:adate) && @litter.adate != params[:adate] && @litter.dogs.exists?
      @litter.dogs.each do |dog|
        dog.dob = params[:adate]
        dog.save!
        changeddogs << dog
      end
      # update the each of the children dob with new adate
      # return something but avoid double render
    else
    end

    if @litter.update(litter_params)
      render json: { litter: @litter, updatedPuppies: changeddogs }
    else
      render json: @litter.errors, status: :unprocessable_entity
    end
  end

  # DELETE /litters/1
  def destroy
    @litter.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_litter
      @litter = Litter.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def litter_params
      params.require(:litter).permit(:breeder_id, :esize, :pdate, :edate, :adate, :lname, :sire_id, :bitch_id, :notional,:dogs)
    end
end
