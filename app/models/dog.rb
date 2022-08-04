class Dog < ApplicationRecord
    acts_as_list

    has_one_attached :main_image

    has_one :puppy_list
    has_one :litter, through: :puppy_list
    accepts_nested_attributes_for :puppy_list, allow_destroy: true
    accepts_nested_attributes_for :litter

    has_one :healthtest, dependent: :destroy
    accepts_nested_attributes_for :healthtest, allow_destroy: true

    has_many :sired_litters, class_name: 'Litter', foreign_key: 'sire_id'
    has_many :bitched_litters, class_name: 'Litter', foreign_key: 'bitch_id'

    scope :puppers, -> {where('dob > ?', 12.weeks.ago)}
    scope :males, -> { where(sex: "1")}
    scope :females, -> { where(sex: "2")}
    scope :retired, -> { where(retired: true)}

end
