class AddDprioToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :dprio, :integer, index:true, null:false
  end
end
