class UsersController < ApplicationController
    
    def create
        @user = User.create(user_params)

        if @user.save
            auth_token = Knock::AuthToken.new payload: {sub: @user.id}
            render json: { username: @user.username, jwt: auth_token.token }, status: :created
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end

    def sign_in
        @user = User.find_by_email(params[:email])

        if @user && @user.authenticate(params[:password])
            auth_token = Knock::AuthToken.new payload: {sub: @user.id}
            render json: { username: @user.username, jwt: auth_token.token }, status: 200
        else
            render json: {error:  "Invalid email or password"}
        end
    end

    def isadmin?(currentuser)
        if current_user.admin
            true
    end

    private
    def user_params
        params.permit(  :username, :email, :password, :password_confirmation,
                        :firstname, :lastname, :address1, :address2,
                        :suburb, :postcode, :phonenumber )
    end

end
