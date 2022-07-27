class ApplicationController < ActionController::API

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
