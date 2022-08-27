class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.boolean :breeder
      t.string :firstname
      t.string :lastname
      t.string :address1
      t.string :address2
      t.string :suburb
      t.integer :postcode
      t.string :phonenumber

      t.timestamps
    end
  end
end
