class PuppyList < ApplicationRecord
    belongs_to :dog
    belongs_to :litter
end
