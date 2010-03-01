ActionController::Dispatcher.to_prepare do
  Site.has_many :playlists, :order => 'playlists.created_at desc', :dependent => :destroy
end