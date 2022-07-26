class ApplicationController < ActionController::API
    include Knock::Authenticable

    def admin_check
        unless current_user.admin?
            render json: { error: "You cannot view this page" }, status: 403
        end
    end

end
