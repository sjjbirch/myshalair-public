class LitterApplicationsController < ApplicationController
  before_action :set_litter_application, only: %i[ show update destroy auth_check assign_puppy process_application ]
  # before_action :match_breeder_and_litter
  before_action :login_check
  before_action :admin_check, only: %i[ assign_puppy applications_for_breeder destroy ]
  before_action :ownership_check, only: %i[ show update ]

  # custom routes

  def process_application
    # Inputs:
    #   params with a litter application, and a fulfillstate
    # Outputs:
    #   updates db with new fulfillstate or doesn't depending on business rules
    #   returns json saying what it did
    # called by:
    #   update
    # Dependencies:
    #   acts_as_list
    # Known issues:
    #   should be a model method
    #   bloated and awful
    # Feature supported:
    #   admin management of litter applications

    if params[:fulfillstate] == 1
      # this triggers only on approving a rejected application or initial processing
      # does not trigger in the case of assigning an application to a litter

      if !params[:priority].nil?d
        @litter_application.update(fulfillstate: params[:fulfillstate])
        @litter_application.insert_at(LitterApplication.waitlisted.approved.count)
        render json: @litter_application
      else
        @litter_application.update(fulfillstate: params[:fulfillstate])
        @litter_application.insert_at(LitterApplication.waitlisted.approved.count)
        render json: @litter_application
      end

    elsif params[:fulfillstate] == 2 && !@litter_application.dog.nil?
      # this triggers if you try to move an application to the waitlist and it has a dog attached to it already

      render json: {success: "Failure", message: "Cannot move an application or change its status once a puppy has been assigned."}, status: :unprocessable_entity

    elsif params[:fulfillstate] == 2 && @litter_application.litter.id > 1
      # this triggers when you return an application from a litter to the waitlist

      @litter_application.fulfillstate = 1
      @litter_application.litter_id = 1
      if @litter_application.save!
        @litter_application.insert_at(1)
        
        render json: @litter_application
      else
        render json: {success: "Failure", message: "Update failed", errors: @litter_application.errors}, status: :unprocessable_entity
      end

    elsif params[:fulfillstate] == 2
      # This triggers if you reject an application in the waitlist

      @litter_application.fulfillstate = params[:fulfillstate]
      if @litter_application.save!
        @litter_application.move_to_bottom
        render json: @litter_application
      else
        render json: {success: "Failure", message: "Update failed", errors: @litter_application.errors}, status: :unprocessable_entity
      end

    else
      render json: {success: "Failure", message: "Update failed, must accept or reject the application"}, status: :unprocessable_entity
    end
  end


  def applications_for_breeder
    # Inputs:
    #   nil
    # Outputs:
    #   a list of all applications for the currently logged in breeder
    #   an empty object if no breeder or no applications
    # called by:
    #   routes
    # Dependencies:
    #   current_user (Devise)
    # Known issues:
    #   should be a model scope, wouldn't even be hard tbh
    # Feature supported:
    #   admin management of litter applications
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


  # def applications_for_user
  #   deprecated. Decided instead to use show for this

  #   @user = current_user
  #   @litter_applications = @user.litter_applications

  #   render json: @litter_applications
  #   ##"View litters for which you have applied."
  # end

  def add_pet
    # Deprecated
    # Inputs:
    #   a litter application object called @litter_application
    #   params with pet information
    # Outputs:
    #   returns json after adding pet to db or not
    # called by:
    #   routes
    # Dependencies:
    #   current_user (Devise)
    # Known issues:
    #   should be a model scope, wouldn't even be hard tbh
    # Feature supported:
    #   users adding dependents to their applications
    @pet = @litter_application.pets.build(age: params[:age], pettype: params[:pettype],
    petbreed: params[:petbreed], desexed: params[:desexed])
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
    # Deprecated
    # as above but children
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
    # replaced the above two functions and combines them
    # for comments see add_pet
    # called only by lazy_application_create
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

  def assign_puppy
    # Inputs:
    #   params with a selected_puppy_id
    # Outputs:
    #   creates join table for dog and application, but not if they aren't associated with the same litter
    #   returns json success or failure render
    # called by:
    #   routes
    # Dependencies:
    #   update
    # Known issues:
    #   should be a model method
    # Feature supported:
    #   admin fulfilling applications

    @dog = Dog.find(params[:selected_puppy_id])
    @puppylist = @dog.puppy_list

    if @litter_application.litter.id == @dog.litter.id
      if @puppylist.update(litter_application_id: @litter_application.id) && @litter_application.update(fulfillstate: 3)
        @dog.update(owner_id: @litter_application.user.id)
        render json: {
          success: "Success", message: "#{@puppylist.dog.callname} added to #{@litter_application.user.username}"
        }, status: 200
      else
        render json: {
          success: "Failure", message: "Failed.", errors: @puppylist.errors
        }, status: :unprocessable_entity
      end
    else
      render json: {
        success: "Failure", message: "Puppy must belong to the same litter as the application to pair them."
      }, status: :unprocessable_entity
    end
  end

  # GET /litter_applications
  def index
    # bog standard index
    @litter_applications = LitterApplication.all
    render json: @litter_applications
  end

  def waitlisted
    # custom index that only shows the waitlisted applications
    # not actually in use on the front end, but I'll be damned if I comment it out
    @litter_applications = LitterApplication.waitlisted
    render json: @litter_applications
  end

  # GET /litter_applications/1
  def show
    # Inputs:
    #   a litter application object called @litter_application
    # Outputs:
    #   an application with its dependents, including pictures where appropriate as json
    # called by:
    #   routes
    # Dependencies:
    #   pets_getter children_getter dog.uri_adder
    # Feature supported:
    #   showing and managing litter applications
    @output = @litter_application
    @output = pets_getter(@litter_application, @output)
    @output = children_getter(@litter_application, @output)
    if @litter_application.dog.nil?
      puppy = nil
    else
      @litter_application.dog.main_image.nil? ? puppy = @litter_application.dog : puppy = @litter_application.dog.uri_adder
    end
    render json: {litterApplication: @output, allocatedPuppy: puppy }
  end

  # POST /lazy_litter_applications
  def lazy_create
    # Inputs:
    #   params including litter_application_params
    #   optionally dependent params
    # Outputs:
    #   new application optionally with dependents on db
    #   json return
    # called by:
    #   routes
    # Dependencies:
    #   lazy_dependent_add
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
    # default rails function
    # unused outside of console test/dev env
    @litter_application = LitterApplication.new(litter_application_params)

    if @litter_application.save
      render json: @litter_application, status: :created, location: @litter_application
    else
      render json: @litter_application.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /litter_applications/1
  def update
    # Inputs:
    #   params including litter_application_params
    # Outputs:
    #   yields to process_application if the application is being processed
    #   updated litter application or failure
    #   json return
    # called by:
    #   routes
    # Dependencies:
    #   process_application

    if params[:fulfillstate] != @litter_application.fulfillstate
      process_application
    elsif params[:litter_id] != @litter_application.litter_id
      @litter_application.remove_from_list
      if @litter_application.update(litter_application_params)
        render json: @litter_application
      else
        render json: @litter_application.errors, status: :unprocessable_entity
      end
    else

      if @litter_application.update(litter_application_params)
        render json: @litter_application
      else
        render json: @litter_application.errors, status: :unprocessable_entity
      end

    end

  end

  # DELETE /litter_applications/1
  def destroy
    # default rails action
    # uncalled
    @litter_application.destroy
  end

    #custom helper functions that should be model methods
  def pets_getter(litter_application, output)
    # Inputs:
    #   takes litter application object and a container for the output
    # Outputs:
    #   adds all pets to the container and returns it
    # called by:
    #   show
    # Dependencies:
    #   nil
    # Known issues:
    #   should be a model method
    # Feature supported:
    #   admin management of litter applications
    if litter_application.pets.exists?
      pets = []
      litter_application.pets.each do |pet|
        pets << pet
      end
      output.as_json.merge({ pets: pets })
    else
      output.as_json.merge({ pets: nil })
    end
  end

  def children_getter(litter_application, output)
    # identical to pets_getter but for children
    if litter_application.children.exists?
      children = []
      litter_application.children.each do |child|
        children << child
      end
      output.as_json.merge({ children: children })
    else
      output.as_json.merge({ children: nil })
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_litter_application
      @litter_application = LitterApplication.find(params[:id])
      @user = @litter_application.user
    end

    # Only allow a list of trusted parameters through.
    def litter_application_params
      auth_check
    end

    def auth_check
      # called by everything
      # checks various things about the request and dynamically sets params based on that
    # Inputs:
    #   a html request
    # Outputs:
    #   params appropriate for the request to the calling function or
    #   a 403 error if the user is being cheeky
    # called by:
    #   everything
    # Dependencies:
    #   current_user (Devise)
      if request.post?
        params.require(:litter_application).permit(
                                                    :user_id, :litter_id, :yardarea,
                                                    :yardfenceheight, :colour_preference, :sex_preference
                                                  )
      elsif current_user.admin
        params.require(:litter_application).permit(
                                                    :user_id, :litter_id, :yardarea,
                                                    :yardfenceheight, :colour_preference, :sex_preference,
                                                    :priority, :fulfillstate, :paystate
                                                  )
      elsif current_user == @litter_application.litter.breeder
        params.require(:litter_application).permit(
                                                    :user_id, :litter_id, :yardarea,
                                                    :yardfenceheight, :colour_preference, :sex_preference,
                                                    :priority, :fulfillstate, :paystate
                                                  )
      elsif current_user == @litter_application.user
        if request.patch?
          params.require(:litter_application).permit(
                                                    :user_id, :yardarea, :yardfenceheight,
                                                    :colour_preference, :sex_preference
                                                  )
        else
          params.require(:litter_application).permit(
                                                      :user_id, :litter_id, :yardarea,
                                                      :yardfenceheight, :fulfillstate, :paystate,
                                                      :colour_preference, :sex_preference
                                                    )
        end
      else
          render json: { error: "You cannot view this page" }, status: 403
      end
    end
    
end
