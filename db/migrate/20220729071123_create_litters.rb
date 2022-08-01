class CreateLitters < ActiveRecord::Migration[7.0]
  def change
    create_table :litters do |t|
      t.references :breeder_id, null: false, foreign_key: true
      t.integer :esize
      t.date :pdate
      t.date :edate
      t.date :adate
      t.text :lname
      t.references :sire_id, null: false, foreign_key: true
      t.references :bitch_id, null: false, foreign_key: true
      t.references :puppy_id, null: false, foreign_key: true
      t.boolean :notional

      t.timestamps
    end
  end
end
