app/views/layout/admin.html.erb
public/images/extjs
public/stylesheets/extjs
public/stylesheets/lico_adva
public/javascripts/extjs
public/javascripts/lico_adva

-- Before you start --
rails my_app -m http://github.com/svenfuchs/adva_cms/raw/master/templates/adva-cms.0.2.4.rb
rake adva:install:all
script/server
> Create website

-- INSTALL --
svn checkout http://plugins.bluerail.nl/yaron/lico_adva_skin vendor/plugins/lico_adva_skin
svn checkout http://plugins.bluerail.nl/yaron/lico_adva_playlists vendor/plugins/lico_adva_playlists
RAIlS_ENV=production rake lico:adva:install
RAIlS_ENV=production rake db:migrate

-- UNINSTALL --
rake lico:adva:uninstall

-- UPDATE --
rake lico:adva:update

e.g.: rake lico:adva:update && touch tmp/restart.txt

-- Notes for developers --

This plugin is meant to be an addon for the ADVA CMS; with a few problems / issues / things to keep in mind:

- It can be installed
- It can be deinstalled
- We need to change some files in other plugins in order to get the stuff working with ExtJS.

The idea is actually quite simple. We have a local collection of files that we need to copy / replace. These files are placed in the lib folder of this plugin. When transferring, all existing files are copied to the backup folder. A uninstall is done by removing all files, which we would copy during install, and by copying all files from the backup folder back to their original location.

Keeping in mind that files in the application are overwritten by files from the lib folder of this plugin, all development must be done in the files in lib. If you're planning to change files in the application itself, remember them and copy them to the lib folder when done.

When people update their application, the following steps are executed:

- uninstall
- update from SVN
- install

-- Adding tabs --

Tabs are stored in the admin.html.erb layout:

tabs = {
  0 => {:controllers => [Admin::ArticlesController], :name => 'articles', :target => url_for(admin_articles_path(@section || Section.find(:first), @site || Site.find(:first)))},
  1 => {:controllers => [Admin::CategoriesController], :name => 'categories', :target => url_for(admin_categories_path(@site || Site.find(:first), @section || Section.find(:first)))},
  2 => {:controllers => [Admin::UsersController], :name => 'users', :target => url_for(admin_users_path)}
}

- The first parameter contains the condition for when this tab is selected. You can include an array of controllers here.
- The name is used to identify the tab in the i18n js
- Finally the taret: simply where to link to

Tab content is determined using ext_tab_content, compatible with:

- a user defined function tab_content(tab_title)
- a user defined function body_items()
- the HTML from <%= yield %>

So: doing nothing results in using <%= yield %> as tab content. See the app/views/admin/articles/index.html.erb for tab_content and body_item usage.

-- i18n --

I've created a start for i18n usage. It now includes i18n_nl.js. 

-- Scrapbook --

Comments? Just use this file (or rene@lico.nl) to discuss...