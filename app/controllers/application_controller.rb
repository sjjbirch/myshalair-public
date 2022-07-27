require "application_responder"

class ApplicationController < ActionController::API
  self.responder = ApplicationResponder
# respond_to :html # I think this will break it so I commented it out - it was added by the responder install


    include ActionController::MimeResponds
    respond_to :json    # both added per: 
                        # https://github.com/waiting-for-dev/devise-jwt/wiki/Configuring-devise-for-APIs
                        # for devise compatibility

    def admin_check
        puts "WARNING: CALLED ADMIN CHECK FUNCTION - SHOULD NOT HAPPEN"
        unless current_user.admin?
            render json: { error: "You cannot view this page" }, status: 403
        end
    end

end
