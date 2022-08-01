class AdminController < ApplicationController

    def list_all_users
        @users = User.all

        render json: @users
    end

end
