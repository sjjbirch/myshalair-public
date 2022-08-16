class RemoveNotionalFromLitter < ActiveRecord::Migration[7.0]
  def change
    remove_column :litters, :notional
  end
end
