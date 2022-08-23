class LittersController < ApplicationController
  before_action :set_litter, only: %i[ show update destroy add_puppy add_puppies showcase_litter ]
  before_action :teapot, only: %i[ update destroy add_puppy add_puppies showcase_litter ]

# custom helpers

def gallery_image_updater
  @litter.gallery_images.attach(params[:gallery_images])
end

def main_image_updater
  @litter.main_image.purge if @litter.main_image.attached?
  @litter.main_image.attach(params[:main_image])
end

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

  def best
    @litters = Litter.all
    images = []
    @litters.each do |litter|
      images << litter.main_image.url if litter.main_image.present?
    end

    images = nil if images.count.zero?

    render json: { images: images }

  end

  def showcase_litter
    if @litter.dogs.present?
      @puppies = @litter.dogs.map { |dog| dog.uri_adder }
    else
      @puppies = nil
    end

    render json: {
    litter: @litter, sire: Dog.find(@litter.sire.id).uri_adder,
    bitch: Dog.find(@litter.bitch.id).uri_adder, puppies: @puppies,
    images: showcase_image_adder(@litter)
    }, status: 200
  end

  def showcase_image_adder(inputlitter)
    images = []
    images << inputlitter.main_image.url if inputlitter.main_image.present?
    @gallery_images = inputlitter.gallery_images
    if @gallery_images
      @gallery_images.each do |image|
        images << image.url
      end
    end
    images = nil if images.count.zero?
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

  def teapot
    render json: { message: "So help me god Hilare, if you ever manage to change the waitlist I will not fix your website."}, status: 418 and return if @litter.id == 1
  end

  # PATCH/PUT /litters/1
  def update
    # if puppies are attached, then update their dob if adate is changed or added
    # should break out into own action, low prio

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
      gallery_image_updater if params[:gallery_images].present?
      main_image_updater if params[:main_image].present?
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
      params.require(:litter).permit(
      :breeder_id, :esize, :pdate, :edate,
      :adate, :lname, :sire_id, :bitch_id,
      :status, :dogs, 
      :main_image, :gallery_images => []
      )
    end
end
