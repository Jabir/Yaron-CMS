class AddDurationToAssets < ActiveRecord::Migration
  def self.up
    add_column :assets, :duration, :integer
  end

  def self.down
    remove_column :assets, :duration
  end
end
