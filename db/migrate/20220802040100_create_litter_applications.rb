class CreateLitterApplications < ActiveRecord::Migration[7.0]
  def change
    create_table :litter_applications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :litter, null: false, foreign_key: true
      t.float :yardarea
      t.float :yardfenceheight
      t.integer :priority, default: 999
      t.integer :fulfillstate
      t.integer :paystate

      t.timestamps
    end
  end
end
