class AddOwnerToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :owner_id, :integer, index: true, default: 1
    add_foreign_key :dogs, :users, column: :owner_id
  end
end

# alternatively     add_reference :dogs, :owner, foreign_key: { to_table: :users } 
# may work