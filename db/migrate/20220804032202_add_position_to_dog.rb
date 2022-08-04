class AddPositionToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :position, :integer, null: false
    add_index :dogs, :position
  end
end
