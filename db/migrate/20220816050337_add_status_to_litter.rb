class AddStatusToLitter < ActiveRecord::Migration[7.0]
  def change
    add_column :litters, :status, :integer, null: false
    add_index :litters, :status
  end
end
