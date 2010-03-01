class PlaylistAsset < ActiveRecord::Base
  validates_presence_of :playlist_id
  validates_presence_of :asset_id
  
  belongs_to :playlist
  belongs_to :asset
end
