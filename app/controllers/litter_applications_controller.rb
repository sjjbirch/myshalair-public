class LitterApplicationsController < ApplicationController
  before_action :set_litter_application, only: %i[ show update destroy auth_check ]
  # before_action :match_breeder_and_litter
  before_action :login_check, except: [:new, :create]

  def process_application
    #the update version for admins that lets priority etc be patched,
    # needs to be separated from a user update that only touches the user stuff
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

  # GET /litter_applications
  def index
    @litter_applications = LitterApplication.all

    render json: @litter_applications
  end

  # GET /litter_applications/1
  def show
    render json: @litter_application
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
