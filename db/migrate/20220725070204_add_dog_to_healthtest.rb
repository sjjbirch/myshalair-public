class AddDogToHealthtest < ActiveRecord::Migration[7.0]
  def change
    add_reference :healthtests, :dog, foreign_key: true
  end
end
