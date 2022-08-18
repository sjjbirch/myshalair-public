class AddColourToDogs < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :colour, :integer, default: 0
  end
end
