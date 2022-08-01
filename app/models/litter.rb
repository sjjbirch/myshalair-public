class Litter < ApplicationRecord
  belongs_to :breeder
  belongs_to :sire
  belongs_to :bitch
end
