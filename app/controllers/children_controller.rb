class ChildrenController < ApplicationController

    private

    def child_params
        params.require(:child).permit(:age, :litter_application_id)
    end
end