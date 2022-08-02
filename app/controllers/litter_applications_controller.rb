class LitterApplicationsController < ApplicationController
  before_action :set_litter_application, only: %i[ show update destroy ]

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
      params.require(:litter_application).permit(:user_id, :litter_id, :yardarea, :yardfenceheight, :priority, :fulfillstate, :paystate)
    end
end
