class LitterApplicationsController < ApplicationController
  before_action :set_litter_application, only: %i[ show update destroy auth_check assign_puppy ]
  # before_action :match_breeder_and_litter
  before_action :login_check, except: [:new, :create] #this should actually be for all outside of testing
  before_action :admin_check, only: %i[ assign_puppy applications_for_breeder ]

  # custom routes

  def process_application
    #the update version for admins that lets priority etc be patched,
    # needs to be separated from a user update that only touches the user stuff
  end

  def assign_puppy
    @dog = Dog.find(params[:selected_puppy_id])
    @puppylist = @dog.puppy_list

    puts @litter_application.litter.id
    # puts params[:selected_puppy_id]
    puts @dog.litter.id
  if @litter_application.litter.dogs.find {|x| x[:id] == :selected_puppy_id}
    puts "dog in litter"
  else
    puts "dog not in litter"
  end

    # unless @litter_application
    #   render json: {
    #     success: "Failure", message: "Puppy must belong to the same litter as the application to pair them."
    #   }, status: :unprocessable_entity
    # end

    # if @puppylist.update(litter_application_id: @litter_application.id)
    #   # add owner to the dog as well
    #   render json: {
    #     success: "Success", message: "#{@puppylist.dog.callname} added to #{@litter_application.user.username}"
    #   }, status: 200
    # else
    #   render json: {
    #     success: "Failure", message: "Honestly it's a miracle the spaghetti code got this far anyway.", errors: @puppylist.errors
    #   }, status: :unprocessable_entity
    # end
  end

  def applications_for_breeder

    @user = current_user
    @apps = []
    @litters = @user.litters_bred

    @litters.each do |litter|
      litter.litter_applications.each do |application|
        @apps << application
      end
    end
    
    render json: {litter_applications: @apps}
  end


  def applications_for_user
    @user = current_user
    @litter_applications = @user.litter_applications

    render json: @litter_applications
    ##"View litters for which you have applied."
  end

  def add_pet
    @pet = @litter_application.pets.build(age: params[:age], pettype: params[:pettype], petbreed: params[:petbreed])
    if @pet.save
      render json: {
        success: "Success", message: "Pet created"
      }, status: 201
    else
      render json: {
        success: "Failure", message: "Pet not created", errors: @litter_application.errors
      }, status: :unprocessable_entity
    end
  end

  def add_child
    @child = @litter_application.children.build(age: params[:age])
    if @child.save
      render json: {
        success: "Success", message: "Child created"
      }, status: 201
    else
      render json: {
        success: "Failure", message: "Child not created", errors: @litter_application.errors
      }, status: :unprocessable_entity
    end
  end

  def lazy_dependent_add
    @children = params[:children]
    @pets = params[:pets]
    dependent_errors = []

    childrentoadd = @children.count
    petstoadd = @pets.count

    if childrentoadd > 0
      @children.each do |child|
          @child = @litter_application.children.build(age: child[:age])
          if @child.save
            childrentoadd -= 1
          else
            @child.errors >> dependent_errors
          end
      end
    end

    if petstoadd > 0
      @pets.each do |pet|
        @pet = @litter_application.pets.build(age: pet[:age], pettype: pet[:pettype], petbreed: pet[:petbreed])
        if @pet.save
          petstoadd -= 1
        else
          @pet.errors >> dependent_errors
        end
      end
    end

    if petstoadd == 0 && childrentoadd == 0
      # send success
    else
      render json: {
        success: "Failure",
        message: "The application was created but at least some of the dependends weren't.",
        errors: dependent_errors
      }, status: :unprocessable_entity
      return
    end

  end

  # GET /litter_applications
  def index
    @litter_applications = LitterApplication.all
    render json: @litter_applications
  end

  # GET /litter_applications/1
  def show
    render json: {litterApplication: @litter_application, availablePuppies: @litter_application.litter.dogs}
  end

  # POST /lazy_litter_applications
  def lazy_create
    @litter_application = LitterApplication.new(litter_application_params)

    if @litter_application.save
      if params[:children].count > 0 or params[:pets].count > 0
        lazy_dependent_add
      end
      render json: @litter_application, status: :created, location: @litter_application
    else
      render json: @litter_application.errors, status: :unprocessable_entity
    end
  end

  # POST /litter_applications
  def create
    @litter_application = LitterApplication.new(litter_application_params)

    if @litter_application.save
      render json: @litter_application, status: :created, location: @litter_application
    else
      render json: @litter_application.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /litter_applications/1
  def update
    if @litter_application.update(litter_application_params)
      render json: @litter_application
    else
      render json: @litter_application.errors, status: :unprocessable_entity
    end
  end

  # DELETE /litter_applications/1
  def destroy
    @litter_application.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_litter_application
      @litter_application = LitterApplication.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def litter_application_params
      auth_check
    end

    def auth_check
      if request.post?
        params.require(:litter_application).permit(:user_id, :litter_id, :yardarea, :yardfenceheight)
      elsif current_user.admin
        params.require(:litter_application).permit(:user_id, :litter_id, :yardarea, :yardfenceheight, :priority, :fulfillstate, :paystate)
      elsif current_user == @litter_application.litter.breeder
        params.require(:litter_application).permit(:user_id, :litter_id, :yardarea, :yardfenceheight, :priority, :fulfillstate, :paystate)
      elsif current_user == @litter_application.user
        if request.patch?
          params.require(:litter_application).permit(:user_id, :yardarea, :yardfenceheight)
        else
          params.require(:litter_application).permit(:user_id, :litter_id, :yardarea, :yardfenceheight, :fulfillstate, :paystate)
        end
      else
          render json: { error: "You cannot view this page" }, status: 403
      end
    end
    
end
