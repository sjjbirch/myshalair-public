class CreateDogs < ActiveRecord::Migration[7.0]
  def change
    create_table :dogs do |t|
      t.string :callname
      t.string :realname
      t.date :dob
      t.integer :sex
      t.string :owner
      t.string :breeder

      t.timestamps
    end
  end
end
