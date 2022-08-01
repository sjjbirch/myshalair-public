class Litter < ApplicationRecord
  belongs_to :breeder, class_name: 'User'
  belongs_to :sire, class_name: 'Dog'
  belongs_to :bitch, class_name: 'Dog'

  has_many :dogs
end
