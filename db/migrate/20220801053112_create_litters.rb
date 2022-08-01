class CreateLitters < ActiveRecord::Migration[7.0]
  def change
    create_table :litters do |t|
      t.references :breeder, null: false#, foreign_key: true
      t.integer :esize
      t.date :pdate
      t.date :edate
      t.date :adate
      t.text :lname
      t.references :sire, null: false#, foreign_key: true
      t.references :bitch, null: false#, foreign_key: true
      t.boolean :notional

      t.timestamps
    end
    add_foreign_key :litters, :dogs, column: :sire_id
    add_foreign_key :litters, :dogs, column: :bitch_id
    add_foreign_key :litters, :users, column: :breeder_id
  end
end
