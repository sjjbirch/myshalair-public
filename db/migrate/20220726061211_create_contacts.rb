class CreateContacts < ActiveRecord::Migration[7.0]
  def change
    create_table :contacts do |t|
      t.string :email
      t.string :phonenumber
      t.integer :reason
      t.string :text

      t.timestamps
    end
  end
end
