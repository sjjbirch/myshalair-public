class Dog < ApplicationRecord

    has_one_attached :main_image

    has_one :puppy_list
    # has_one :parent_litter, class_name: 'Litter', through: :puppy_list
    has_one :litter, through: :puppy_list
    # has_one :breeder, through: :parent_litter

    has_one :healthtest, dependent: :destroy

    has_many :sired_litters, class_name: 'Litter', foreign_key: 'sire_id'
    has_many :bitched_litters, class_name: 'Litter', foreign_key: 'bitch_id'

    # accepts_nested_attributes_for :litters
    accepts_nested_attributes_for :healthtest, allow_destroy: true #is this correct? It seems redundant

    scope :puppers, -> {where('dob > ?', 12.weeks.ago)}
    scope :males, -> { where(sex: "1")}
    scope :females, -> { where(sex: "2")}

end
