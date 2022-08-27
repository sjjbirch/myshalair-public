class LittersController < ApplicationController
  before_action :set_litter, only: %i[ show update destroy add_puppy add_puppies showcase_litter ]
  before_action :teapot, only: %i[ update destroy add_puppy add_puppies showcase_litter ]
  before_action :admin_check, only: %i[ create update destroy add_puppy add_puppies ]

  # custom route actions

  def best
    # Inputs:
    #   none
    # Outputs:
    #   the main image for every litter in the db
    # called by:
    #   routes
    # Dependencies:
    #   activerecord
    # Supports feature:
    #   litter gallery
    @litters = Litter.all
    images = []
    @litters.each do |litter|
      images << litter.main_image.url if litter.main_image.present?
    end
    images = nil if images.count.zero?

    render json: { images: images }

  end

  def showcase_litter
    # Inputs:
    #   none
    # Outputs:
    #   all of the pictures and puppies with their main image for a litter 
    #   and the sire and bitch of a litter with their pictures
    # called by:
    #   routes Dog.uri_adder
    # Dependencies:
    #   activerecord
    # Supports feature:
    #   user view litter show
    if @litter.dogs.present?
      @puppies = @litter.dogs.map { |dog| dog.uri_adder }
    else
      @puppies = nil
    end

    images = []
    images << @litter.main_image.url if @litter.main_image.present?
    @gallery_images = @litter.gallery_images
    if @gallery_images
      @gallery_images.each do |image|
        images << image.url
      end
    end
    images = nil if images.count.zero?

    render json: {
      litter: @litter,
      sire: Dog.find(@litter.sire.id).uri_adder,
      bitch: Dog.find(@litter.bitch.id).uri_adder,
      puppies: @puppies,
      images: images
    },
    status: 200
  end

  def add_puppy
    # Inputs:
    #   litter object called @litter and dog params
    # Outputs:
    #   saves dog to db and creates join table for it to the litter
    # called by:
    #   routes
    # Dependencies:
    #   activerecord
    # Supports feature:
    #   admin add puppies to litters
    @doggo = @litter.dogs.build( callname: params[:callname], realname: params[:realname], 
                                 dob: @litter.adate, sex: params[:sex], colour: params[:colour] )
    if @doggo.save
      @doggo.main_image.attach(params[:main_image]) if params[:main_image].present?
      render json: { success: "Success", message: "#{params[:callname]} created", dog: @doggo }, status: 201
    else
      render json: { success: "Failure", message: "#{params[:callname]} not created", errors: @litter.errors }, status: :unprocessable_entity
    end
  end

  def add_puppies
    # as above but a bulk add of many puppies at once
    # doesn't support image upload
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
      dob: @litter.adate, sex: dog[:sex], colour: params[:colour] )
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
    # Inputs:
    #   none
    # Outputs:
    #   all litters, with return fields censored by user auth level
    # called by:
    #   routes
    # Dependencies:
    #   activerecord Litter.pleb
    # Supports feature:
    #   dog index
    if current_user.nil? or !current_user.admin?
      @litters = Litter.pleb
    else
      @litters = Litter.all
    end
    render json: @litters
  end

  # GET /litters/1
  def show
    # Inputs:
    #   a litter called @litter
    # Outputs:
    #   none
    # called by:
    #   routes
    # Dependencies:
    #   plebshow adminshow
    # Supports feature:
    #   showing litter without all dependents for updating state
    if current_user.nil? or !current_user.admin?
      plebshow
    else
      adminshow
    end
  end

  def plebshow
    # Inputs:
    #   litter called @litter
    # Outputs:
    #   a litter with its puppies but not other dependents (for eg apps) as json
    # called by:
    #   show
    # Dependencies:
    #   puppy_getter
    # Supports feature:
    #   showing litter without all dependents for updating state
    @output = @litter
    @output = puppy_getter(@litter, @output)
    render json: @output
  end

  def adminshow
    # Inputs:
    #   litter called @litter
    # Outputs:
    #   a litter with its puppies and apps as json
    # called by:
    #   show
    # Dependencies:
    #   puppy_getter litter_applications_getter
    # Supports feature:
    #   showing litter with some dependents for updating state
    @output = @litter
    @output = puppy_getter(@litter, @output)
    @output = litter_applications_getter(@litter, @output)
    render json: @output
  end

  # POST /litters
  def create
    # bog standard rails create
    @litter = Litter.new(litter_params)

    if @litter.save
      render json: @litter, status: :created, location: @litter
    else
      render json: @litter.errors, status: :unprocessable_entity
    end
  end

  def teapot
    # Inputs:
    #   Nil
    # Outputs:
    #   a 403 error and a message
    # called by:
    #   everything
    # Dependencies:
    #   nil
    # Supports feature:
    #   The user requested a change to functionality late in development which necessitated creating a special litter.
    #   The special litter is a waitlist. If the user ever managed to change it, it would break the whole website.
    #   This function guards that litter and dissaudes the owner from making further attempts to edit it.
    render json: { message: "So help me god Hilare, if you ever manage to change the waitlist I will not fix your website."}, status: 418 and return if @litter.id == 1
  end

  # PATCH/PUT /litters/1
  def update
    # Inputs:
    #   litter called @litter
    # Outputs:
    #   updates db with new litter params
    #   updates the dob of any puppies in the litter if the litter's date was changed
    #   returns stuff as json
    # called by:
    #   routes
    # Dependencies:
    #   gallery_image_updater main_image_updater
    # Supports feature:
    #   updating litters

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
    # uncalled
    # bog standard destroy
    @litter.destroy
  end

  # controller actions that should be helper or model methods

  def gallery_image_updater
    # Unused
    # Inputs:
    #   params including a an array of one or more gallery_images
    # Outputs:
    #   attaches gallery images to activestorage and returns to calling function
    # called by:
    #   update
    # Dependencies:
    #   activestorage
    # Supports feature:
    #   update the gallery_images of a litter
    @litter.gallery_images.attach(params[:gallery_images])
  end

  def main_image_updater
    # Inputs:
    #   params including a main_image
    # Outputs:
    #   attaches main image to litter, deletes old one if it existed, returns to calling function
    # called by:
    #   update
    # Dependencies:
    #   activestorage
    # Supports feature:
    #   uploading and updating images of litters
    @litter.main_image.purge if @litter.main_image.attached?
    @litter.main_image.attach(params[:main_image])
  end

  def puppy_getter(litter,output)
    # Inputs:
    #   litter object called litter
    # Outputs:
    #   a litter with all of its puppies as well as a separate list of the ids of puppies that are not assigned to customers
    #   unassigned list is only returned to admins else nil
    # called by:
    #   plebshow adminshow
    # Dependencies:
    #   nil
    # Supports feature:
    #   managing litter applications
    if litter.dogs.exists?
      puppies = []
      unassigned = []
      litter.dogs.each do |puppy|
        puppies << puppy
        unassigned << puppy.id if puppy.owner_id == 1
      end

      if current_user.nil? or !current_user.admin?
        output.as_json.merge({ puppies: puppies.as_json(:except => [:chipnumber]) })
      elsif unassigned.count.nil?
        output.as_json.merge({ puppies: puppies, unassigned: nil })
      else
        output.as_json.merge({ puppies: puppies, unassigned: unassigned })
      end

    else
      output.as_json.merge({ puppies: nil, unassigned: nil })
    end
  end

  def litter_applications_getter(litter, output)
    # Inputs:
    #   litter object called litter
    # Outputs:
    #   the litters with its applications merged onto it as json
    # called by:
    #   adminshow
    # Dependencies:
    #   nil
    # Supports feature:
    #   managing litter applications
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
