class AdminController < ApplicationController
    before_action :admin_check

    def list_all_users
        # Inputs: nil
        # Outputs: json list of all users
        # Supports feature: Frontend homepage
        @users = User.all
        render json: @users
    end

end
