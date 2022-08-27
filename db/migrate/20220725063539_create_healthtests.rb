class CreateHealthtests < ActiveRecord::Migration[7.0]
  def change
    create_table :healthtests do |t|
      t.integer :pra
      t.integer :fn
      t.integer :aon
      t.integer :ams
      t.integer :bss

      t.timestamps
    end
  end
end
