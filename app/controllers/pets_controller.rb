class PetsController < ApplicationController

    private

    def pet_params
        params.require(:pet).permit(:age, :pettype, :petbreed, :desexed, :litter_application_id)
    end
end