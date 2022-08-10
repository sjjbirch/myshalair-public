class CreatePuppyLists < ActiveRecord::Migration[7.0]
  def change
    create_table :puppy_lists do |t|
      t.references :dog, foreign_key: true#, null: false#
      t.references :litter, foreign_key: true
      t.references :litter_application, foreign_key: true

      t.timestamps
    end
  end
end
