class UsersController < ApplicationController
    before_action :set_user, only: %i[show]
    before_action :ownership_check, only: %i[show]

    def show
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

        # render json: { user: @user, main_image: @user.main_image.url, applications: @litter_apps, dogs: @dogs, bred_litters: @bredlitters }
        render json: @contacts, :only => [:id, :fname]
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