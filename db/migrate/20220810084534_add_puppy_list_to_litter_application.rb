class AddPuppyListToLitterApplication < ActiveRecord::Migration[7.0]
  def change

    add_reference :puppy_lists, :litter_application, foreign_key: true


  end
end
