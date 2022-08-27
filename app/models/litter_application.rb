class LitterApplication < ApplicationRecord
  acts_as_list scope: :litter, column: :priority
  
  belongs_to :user
  belongs_to :litter

  has_many :children
  has_many :pets

  has_one :puppy_list
  has_one :dog, through: :puppy_list

  accepts_nested_attributes_for :children, allow_destroy: true
  accepts_nested_attributes_for :pets, allow_destroy: true
  accepts_nested_attributes_for :dog

  scope :approved, -> { where(fulfillstate: "1")}
  scope :rejected, -> { where(fulfillstate: "2")}
  scope :completed, -> { where(fulfillstate: "3")}
  scope :assigned_to_litter, -> { where('litter_id > ?', 1)}
  scope :waitlisted, -> { where(litter_id: "1")} 

end
