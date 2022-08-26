class LitterApplicationsController < ApplicationController
  before_action :set_litter_application, only: %i[ show update destroy auth_check assign_puppy process_application ]
  # before_action :match_breeder_and_litter
  before_action :login_check
  before_action :admin_check, only: %i[ assign_puppy applications_for_breeder destroy ]
  before_action :ownership_check, only: %i[ show update ]

  #custom helper functions
  def pets_getter(litter_application, output)
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

  # custom routes

  def process_application
    #the update version for admins that lets priority etc be patched,
    # needs to be separated from a user update that only touches the user stuff
    # this needs more testing with more seeds, I'm not convinced that priority shuffling is working

    if params[:fulfillstate] == 1
      # this triggers only on approving a rejected application or initial processing
      # does not trigger in the case of assigning an application to a litter
      5.times do
        puts "normal processing"
      end

      if !params[:priority].nil?
        50.times do
          puts "IT SAYS IT HAS A PRIORITY VALUE"
        end
        @litter_application.update(fulfillstate: params[:fulfillstate])
        @litter_application.insert_at(LitterApplication.waitlisted.approved.count)
        render json: @litter_application
      else
        50.times do
          puts "NO PRIORITY VALUE"
        end
        @litter_application.update(fulfillstate: params[:fulfillstate])
        @litter_application.insert_at(LitterApplication.waitlisted.approved.count)
        render json: @litter_application
      end

    elsif params[:fulfillstate] == 2 && !@litter_application.dog.nil?

      5.times do
        puts "trying to move an application with puppy attached"
      end

      render json: {success: "Failure", message: "Cannot move an application or change its status once a puppy has been assigned."}, status: :unprocessable_entity

    elsif params[:fulfillstate] == 2 && @litter_application.litter.id > 1

      5.times do
        puts "trying to reject an application that's on a litter (moving to waitlist)"
      end

      @litter_application.fulfillstate = 1
      @litter_application.litter_id = 1
      if @litter_application.save!
        @litter_application.insert_at(1)
        
        render json: @litter_application
      else
        render json: {success: "Failure", message: "Update failed", errors: @litter_application.errors}, status: :unprocessable_entity
      end

    elsif params[:fulfillstate] == 2

      5.times do
        puts "normal rejection"
      end

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

  def assign_puppy
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
          success: "Failure", message: "Honestly it's a miracle the spaghetti code got this far anyway.", errors: @puppylist.errors
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
    @litter_applications = LitterApplication.all
    render json: @litter_applications
  end

  def waitlisted
    @litter_applications = LitterApplication.waitlisted
    render json: @litter_applications
  end

  # GET /litter_applications/1
  def show
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
    @litter_application.destroy
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
