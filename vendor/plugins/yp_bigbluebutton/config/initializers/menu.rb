module Menus
  module Admin
    class Conferences < Menu::Group
      define do
        id :main
        parent Sites.new.build(scope).find(:conferences)
      end
    end
  end
end
