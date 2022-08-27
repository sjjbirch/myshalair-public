require "application_responder"

class ApplicationController < ActionController::API
  self.responder = ApplicationResponder
# respond_to :html # I think this will break it so I commented it out - it was added by the responder install

before_action :configure_permitted_parameters, if: :devise_controller?
# before_action :strip_user_jti, if: :devise_controller?


    # include ActionController::MimeResponds
    respond_to :json    # both added per: 
                        # https://github.com/waiting-for-dev/devise-jwt/wiki/Configuring-devise-for-APIs
                        # for devise compatibility

    def admin_check
      # Inputs:
      #   nil
      # Outputs:
      #   json errors and statuses if the user is not an admin
      #   if the user is an admin it returns to the calling function
      # Called by:
      #   admin# :list_all_users, contacts# :index, :show, :update, :destroy,
      #   dogs# update destroy create find_dog_by_chipnumber lazy_dog_create,
      #   litter_applications#  assign_puppy applications_for_breeder destroy,
      #   litters#  create update destroy add_puppy add_puppies,
      # Dependencies:
      #   Requires current_user (devise)
      if current_user.nil?
        render json: { error: "You cannot view this page." }, status: 401# and return
      elsif !current_user.admin?
        render json: { error: "You cannot view this page, pleb." }, status: 403# and return
      end
    end

    def login_check
      # Inputs:
      #   nil
      # Outputs:
      #   render json error if the user is not logged in
      #   if the user is logged in it returns to the calling function
      # Called by:
      #   litter_application# all
      #   
      # Dependencies:
      #   Requires current_user (devise)
      if current_user.nil?
        render json: { error: "You cannot view this page." }, status: 401# and return
      end
    end

    def ownership_check
      # Inputs:
      #   a user object called @user that is the user that owns the entity you want to check
      # Outputs:
      #   render json errors if the user isn't logged in or logged in user doesn't own the object
      #   otherwise return to the calling function
      # Called by:
      #   litter_application# show update,
      #   users# show update
      # Dependencies:
      #   Requires current_user (devise)
      if current_user.nil?
        render json: { error: "You cannot view this page." }, status: 401
      else
        unless current_user.admin? or current_user.id == @user.id
          render json: { error: "You cannot view this page." }, status: 403
        end
      end
    end

    protected

    def configure_permitted_parameters
      # Replaces default devise function of the same name:
      # Default devise function cannot handle params nested in JSON
      # Inputs:
      #   params nested in a sign up object
      # Outputs:
      #   filters then sanitizes params provided before passing them to db devise actions
      # Called by:
      #   devise# all (before action)
      # Dependencies:
      #   Requires devise_parameter_sanitizer
      devise_parameter_sanitizer.permit(:sign_up, keys:
      [:username, :postcode, :firstname, :lastname,
      :address1, :address2, :suburb, :phonenumber]
      )
    end
    
end
