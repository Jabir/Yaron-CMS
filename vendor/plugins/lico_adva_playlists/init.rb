I18n.load_path += Dir[File.join(File.dirname(__FILE__), 'config', 'locales', '**/*.{rb,yml}')]

# register_javascript_expansion :admin => %w( lico_adva_playlists/admin/playlists )
register_stylesheet_expansion :admin => %w( lico_adva_playlists/admin/playlists )
