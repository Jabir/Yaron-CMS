class Playlist < ActiveRecord::Base
  validates_presence_of :site_id
  validates_presence_of :title
  
  belongs_to :site
  has_many :playlist_assets, :dependent => :destroy
  
  has_many :assets, :through => :playlist_assets
end
