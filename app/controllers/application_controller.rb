class ApplicationController < ActionController::API

    def admin_check
        puts "WARNING: CALLED ADMIN CHECK FUNCTION - SHOULD NOT HAPPEN"
        unless current_user.admin?
            render json: { error: "You cannot view this page" }, status: 403
        end
    end

end
