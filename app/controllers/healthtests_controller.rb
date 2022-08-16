
class HealthtestsController < ApplicationController

    after_initialize do
        if self.new_record?
            # values will be available for new record forms - BUT this is placeholder code;
            # actual business logic required to prefill and lock health tests that are 
            # already guaranteed by pedigree by calling a variant of the pedigree()
            # function in the dog controller 
            self.pra = 0
            self.fn = 0
            self.aon = 0
            self.ams = 0
            self.bss = 0
        end
    end

    private

    def healthtest_params
        params.require(:healthtest).permit( :pra, :fn, :aon, :ams, :bss)
    end


end