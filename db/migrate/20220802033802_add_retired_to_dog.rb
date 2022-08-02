class AddRetiredToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :retired, :boolean, default: false
  end
end
