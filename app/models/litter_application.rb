class LitterApplication < ApplicationRecord
  belongs_to :user
  belongs_to :litter
  has_many :children
  has_many :pets

  accepts_nested_attributes_for :children, allow_destroy: true
  accepts_nested_attributes_for :pets, allow_destroy: true

end
