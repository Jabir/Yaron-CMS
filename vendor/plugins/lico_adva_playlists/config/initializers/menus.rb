module Menus
  module Admin
    class Playlists < Menu::Group
      define do
        id :main
        parent Sites.new.build(scope).find(:playlists)
      end
    end
  end
end
