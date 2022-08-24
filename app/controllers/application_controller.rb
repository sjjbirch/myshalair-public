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
        puts "WARNING: CALLED ADMIN CHECK FUNCTION - SHOULD NOT HAPPEN, unsure if this is still valid"
        unless current_user.admin?
            render json: { error: "You cannot view this page" }, status: 403 and return
        end
    end

    def login_check
      # need a login check here
      if current_user == nil
        render json: { error: "You cannot view this page" }, status: 401 and return
        # redirect them to login
      end
    end

    protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys:
      [:username, :postcode, :firstname, :lastname,
      :address1, :address2, :suburb, :phonenumber]
      )
    end
    
end
