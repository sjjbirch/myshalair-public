class PuppyList < ApplicationRecord
    belongs_to :dog
    belongs_to :litter

    # accepts_nested_attributes_for :dog
    # accepts_nested_attributes_for :litter
end
