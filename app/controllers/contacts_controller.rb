class ContactsController < ApplicationController
  # before_action :admin_check, only: [ :index, :show, :update, :destroy ]
  # before_action :set_contact, only: %i[ show update destroy ]
  before_action :deprecated

  # This whole controller is deprecated because the client
  # requested for the features it supports to be removed.

  def deprecated
    render json: {
      success: "Failure",
      message: "Do not meddle in the affairs of the parliament of bugs. You have been warned."
    },
      status: 404
  end

  # GET /contacts
  def index
    @contacts = Contact.all
    render json: @contacts
  end

  # GET /contacts/1
  def show
    render json: @contact
  end

  # POST /contacts
  def create
    @contact = Contact.new(contact_params)

    if @contact.save
      render json: @contact, status: :created, location: @contact
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contacts/1
  def update
    if @contact.update(contact_params)
      render json: @contact
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # DELETE /contacts/1
  def destroy
    @contact.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contact
      @contact = Contact.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def contact_params
      params.require(:contact).permit(:email, :phonenumber, :reason, :text)
    end
end
