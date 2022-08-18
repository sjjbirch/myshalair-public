class AddDescriptionToDog < ActiveRecord::Migration[7.0]
  def change
    add_column :dogs, :description, :text, default: "This dog doesn't yet have a description."
  end
end
