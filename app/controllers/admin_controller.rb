class AdminController < ApplicationController
    before_action :admin_check

    def list_all_users
        @users = User.all
        render json: @users
    end

end
