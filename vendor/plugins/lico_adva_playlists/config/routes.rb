ActionController::Routing::Routes.draw do |map|
  map.resources :playlists, :controller  => 'admin/playlists',
                            :path_prefix => 'admin/sites/:site_id',
                            :name_prefix => 'admin_'
end