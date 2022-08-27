class AddPreferencesToLitterApplications < ActiveRecord::Migration[7.0]
  def change
    add_column :litter_applications, :colour_preference, :integer
    add_column :litter_applications, :sex_preference, :integer
  end
end
