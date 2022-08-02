class LitterApplication < ApplicationRecord
  belongs_to :user
  belongs_to :litter
  has_many :children
  has_many :pets

end
