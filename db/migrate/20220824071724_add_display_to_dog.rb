class AddDisplayToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :display, :boolean, index: true, default: true
  end
end
