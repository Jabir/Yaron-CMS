ActionController::Routing::Routes.draw do |map|
  map.resources :conferences, :controller  => 'admin/conferences',
                              :path_prefix => 'admin/sites/:site_id',
                              :name_prefix => 'admin_'
end