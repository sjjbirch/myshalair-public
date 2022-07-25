
class HealthtestsController < ApplicationController

    def healthtest_params
        params.require(:healthtest).permit( :pra, :fn, :aon, :ams, :bss)
    end

    after_initialize do
        if self.new_record?
            # values will be available for new record forms - BUT this is placeholder code;
            # actual business logic required to prefill and lock health tests that are 
            # already guaranteed by pedigree by calling checkpedigree()
            self.pra = 0
            self.fn = 0
            self.aon = 0
            self.ams = 0
            self.bss = 0
        end
    end


    def new
        @dog = Dog.find(params[:dog_id])
        #  getting a dog instance from params so we can instantiate our new ad
        @healthtest = Healthtest.new
    end

    def build
    end

    def create
        @dog = Dog.find(params[:dog_id])
       #  as above, both are used in different places
        @healthtest = @dog.build_healthtest(healthtest_params)
        if @healthtest.save
            # send something to the front end
        else
          # send something to the front end
        end
     end

    def checkpedigree
    # this is where it will check which tests don't need to be done
    end

end