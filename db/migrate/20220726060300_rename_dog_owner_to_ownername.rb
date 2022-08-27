class RenameDogOwnerToOwnername < ActiveRecord::Migration[7.0]
  def change
    rename_column :dogs, :owner, :ownername
    rename_column :dogs, :breeder, :breedername
  end
end
