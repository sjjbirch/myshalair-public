class Litter < ApplicationRecord
  belongs_to :breeder, class_name: 'User'
  belongs_to :sire, class_name: 'Dog'
  belongs_to :bitch, class_name: 'Dog'
  
  has_many :puppy_list
  has_many :dogs, through: :puppy_list
  accepts_nested_attributes_for :puppy_list
  accepts_nested_attributes_for :dogs

  has_many :litter_applications
end
