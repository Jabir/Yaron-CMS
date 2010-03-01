class AddPlaylists < ActiveRecord::Migration
  def self.up
    create_table :playlists, :force => true do |t|
      t.string :title
      t.integer :site_id
      t.timestamps
    end
    
    create_table :playlist_assets, :force => true do |t|
      t.integer :playlist_id
      t.integer :asset_id
    end
  end

  def self.down
    drop_table :playlist_assets
    drop_table :playlists
  end
end
