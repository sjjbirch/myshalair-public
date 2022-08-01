class AddLitterToPuppy < ActiveRecord::Migration[7.0]
  def change

    add_reference :dogs, :litter, foreign_key: true
 # add: #, null: false# if strict relationship
  end
end
