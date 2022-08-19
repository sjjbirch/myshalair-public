class AddDesexedToPet < ActiveRecord::Migration[7.0]
  def change
    add_column :pets, :desexed, :boolean, default: false
  end
end
