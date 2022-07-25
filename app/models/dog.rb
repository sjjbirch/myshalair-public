class Dog < ApplicationRecord

    has_one_attached :main_image
    has_one :healthtest, dependent: :destroy

    scope :puppers, -> {where('dob > ?', 12.weeks.ago)}
    scope :males, -> { where(sex: "1")}
    scope :females, -> { where(sex: "2")}


end
