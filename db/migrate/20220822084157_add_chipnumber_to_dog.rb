class AddChipnumberToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :chipnumber, :string
  end
end
