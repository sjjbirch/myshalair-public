require "application_responder"

class ApplicationController < ActionController::API
  self.responder = ApplicationResponder
# respond_to :html # I think this will break it so I commented it out - it was added by the responder install

before_action :configure_permitted_parameters, if: :devise_controller?

    # include ActionController::MimeResponds
    respond_to :json    # both added per: 
                        # https://github.com/waiting-for-dev/devise-jwt/wiki/Configuring-devise-for-APIs
                        # for devise compatibility

    def admin_check
      if current_user.nil?
        render json: { error: "You cannot view this page." }, status: 401# and return
      elsif !current_user.admin?
        render json: { error: "You cannot view this page, pleb." }, status: 403# and return
      end
    end

    def login_check
      if current_user.nil?
        render json: { error: "You cannot view this page" }, status: 401# and return
      end
    end

    def ownership_check
      # if the user is an admin, if they are then let them do whatever
      # if the user owns the asset, then let them do whatever
      # if neither are true then # render json: { error: "You cannot view this page" }, status: 401 and return
    end

    protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys:
      [:username, :postcode, :firstname, :lastname,
      :address1, :address2, :suburb, :phonenumber]
      )
    end
    
end
