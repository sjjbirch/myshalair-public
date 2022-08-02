class CreateChildren < ActiveRecord::Migration[7.0]
  def change
    create_table :children do |t|
      t.references :litter_application, null: false, foreign_key: true
      t.integer :age

      t.timestamps
    end
  end
end
