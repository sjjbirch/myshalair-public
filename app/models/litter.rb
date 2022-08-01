class Litter < ApplicationRecord
  belongs_to :breeder_id
  belongs_to :sire_id
  belongs_to :bitch_id
  belongs_to :puppy_id
end
