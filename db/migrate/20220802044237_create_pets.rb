class CreatePets < ActiveRecord::Migration[7.0]
  def change
    create_table :pets do |t|
      t.references :litter_application, null: false, foreign_key: true
      t.integer :age
      t.text :pettype
      t.text :petbreed

      t.timestamps
    end
  end
end
