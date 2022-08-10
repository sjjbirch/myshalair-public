class LitterApplication < ApplicationRecord
  belongs_to :user
  belongs_to :litter

  has_many :children
  has_many :pets

  has_one :puppy_list
  has_one :dog, through: :puppy_list

  accepts_nested_attributes_for :children, allow_destroy: true
  accepts_nested_attributes_for :pets, allow_destroy: true
  accepts_nested_attributes_for :dog

end
