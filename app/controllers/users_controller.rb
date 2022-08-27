class UsersController < ApplicationController
    before_action :set_user, only: %i[show update]
    before_action :ownership_check, only: %i[ show update ]

    def show
    # Inputs:
    #   a user object called @user
    # Outputs:
    #   as json a user with everything that belongs to them
    # called by:
    #  routes
    # Dependencies:
    #   Dog.main_image_adder
    # Supports feature:
    #   user profiles
        @litter_apps = []
        @dogs = []
        @bredlitters = []

        @user.litter_applications.each do |application|
            @litter_apps << application
            if application.puppy_list.present?
                @dogs << application.puppy_list.dog.main_image_adder
            end
        end

        @user.litters_bred.each do |litter|
            @bredlitters << litter
        end

        @litter_apps = nil if @litter_apps.count.zero?
        @dogs = nil if @dogs.count.zero?
        @bredlitters = nil if @bredlitters.count.zero?

        render json: { user: @user.as_json(:except => [:jti]), main_image: @user.main_image.url, applications: @litter_apps, dogs: @dogs, bred_litters: @bredlitters }
    end

    def update
        # standard rails update
    
        if @user.update(user_params)
            render json: @user
        else
            render json: @user.errors, status: :unprocessable_entity
        end

    end

    private

    def set_user
        @user = User.find(params[:id])
    end

    def user_params
        params.require(:user).permit(:username, :postcode, :firstname, :lastname,
        :address1, :address2, :suburb, :phonenumber, :main_image)
    end

end