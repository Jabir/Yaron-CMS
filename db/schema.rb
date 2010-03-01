# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091020200920) do

  create_table "accounts", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "activities", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.integer  "author_id"
    t.string   "author_type"
    t.string   "author_name",       :limit => 40
    t.string   "author_email",      :limit => 40
    t.string   "author_homepage"
    t.string   "actions"
    t.integer  "object_id"
    t.string   "object_type",       :limit => 15
    t.text     "object_attributes"
    t.datetime "created_at",                      :null => false
  end

  create_table "adva_cronjobs", :force => true do |t|
    t.integer  "cronable_id"
    t.string   "cronable_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "command"
    t.string   "minute",        :default => "*"
    t.string   "hour",          :default => "*"
    t.string   "day",           :default => "*"
    t.string   "month",         :default => "*"
    t.string   "weekday",       :default => "*"
    t.string   "cron_id"
  end

  create_table "adva_emails", :force => true do |t|
    t.string   "from"
    t.string   "to"
    t.integer  "last_send_attempt", :default => 0
    t.text     "mail"
    t.datetime "created_at"
  end

  create_table "adva_issues", :force => true do |t|
    t.integer  "newsletter_id"
    t.string   "title",                                  :null => false
    t.text     "body",                                   :null => false
    t.datetime "deliver_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.boolean  "track",             :default => false
    t.string   "tracking_campaign"
    t.string   "tracking_source"
    t.datetime "published_at"
    t.text     "body_html"
    t.string   "filter"
    t.datetime "delivered_at"
    t.datetime "queued_at"
    t.string   "state",             :default => "draft"
    t.text     "body_plain"
  end

  create_table "adva_newsletters", :force => true do |t|
    t.integer  "site_id"
    t.integer  "subscriptions_count", :default => 0
    t.integer  "issues_count",        :default => 0
    t.string   "title",                              :null => false
    t.text     "desc"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.string   "email"
    t.integer  "published",           :default => 1
    t.string   "name"
  end

  create_table "adva_subscriptions", :force => true do |t|
    t.integer  "user_id",           :null => false
    t.integer  "subscribable_id",   :null => false
    t.string   "subscribable_type", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.datetime "confirmed_at"
  end

  create_table "asset_assignments", :force => true do |t|
    t.integer  "content_id"
    t.integer  "asset_id"
    t.string   "label"
    t.datetime "created_at"
    t.boolean  "active"
  end

  create_table "assets", :force => true do |t|
    t.integer  "site_id"
    t.integer  "user_id"
    t.string   "content_type"
    t.string   "filename"
    t.string   "title"
    t.datetime "created_at"
    t.string   "data_file_name"
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.datetime "data_updated_at"
    t.string   "cached_tag_list"
    t.string   "assetable_type"
    t.integer  "assetable_id"
    t.integer  "duration"
  end

  create_table "boards", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.string   "title"
    t.string   "permalink"
    t.text     "description"
    t.integer  "position"
    t.integer  "last_post_id"
    t.integer  "last_author_id"
    t.string   "last_author_type"
    t.string   "last_author_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "last_updated_at"
  end

  create_table "cached_page_references", :force => true do |t|
    t.integer "cached_page_id"
    t.integer "object_id"
    t.string  "object_type"
    t.string  "method"
  end

  create_table "cached_pages", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.string   "url"
    t.datetime "updated_at"
    t.datetime "cleared_at"
  end

  create_table "calendar_events", :force => true do |t|
    t.string   "title",                              :null => false
    t.string   "permalink"
    t.datetime "start_date",                         :null => false
    t.datetime "end_date"
    t.datetime "published_at"
    t.string   "host"
    t.text     "body"
    t.text     "body_html"
    t.string   "filter"
    t.integer  "parent_id"
    t.integer  "section_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "all_day",         :default => false, :null => false
    t.string   "location"
    t.string   "cached_tag_list"
  end

  add_index "calendar_events", ["permalink"], :name => "index_calendar_events_on_permalink", :unique => true

  create_table "categories", :force => true do |t|
    t.integer "section_id"
    t.integer "parent_id"
    t.integer "lft",        :default => 0, :null => false
    t.integer "rgt",        :default => 0, :null => false
    t.string  "title"
    t.string  "path"
    t.string  "permalink"
  end

  create_table "categorizations", :force => true do |t|
    t.integer "categorizable_id"
    t.integer "category_id"
    t.string  "categorizable_type"
  end

  create_table "category_translations", :force => true do |t|
    t.integer  "category_id"
    t.string   "locale"
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "category_translations", ["category_id"], :name => "index_category_translations_on_category_id"

  create_table "comments", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.integer  "commentable_id"
    t.string   "commentable_type"
    t.integer  "author_id"
    t.string   "author_type"
    t.string   "author_name",      :limit => 40
    t.string   "author_email",     :limit => 40
    t.string   "author_homepage"
    t.text     "body"
    t.text     "body_html"
    t.integer  "approved",                       :default => 0, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "spaminess"
    t.integer  "board_id"
  end

  create_table "content_translations", :force => true do |t|
    t.integer  "content_id"
    t.string   "locale"
    t.integer  "version"
    t.boolean  "current"
    t.text     "excerpt_html"
    t.text     "excerpt"
    t.string   "title"
    t.text     "body_html"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contents", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.string   "type",             :limit => 20
    t.integer  "position"
    t.string   "permalink"
    t.text     "excerpt_html"
    t.text     "body_html"
    t.integer  "author_id"
    t.string   "author_type"
    t.string   "author_name",      :limit => 40
    t.string   "author_email",     :limit => 40
    t.string   "author_homepage"
    t.integer  "version"
    t.string   "filter"
    t.integer  "comment_age",                    :default => 0
    t.string   "cached_tag_list"
    t.integer  "assets_count",                   :default => 0
    t.datetime "published_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "meta_author"
    t.string   "meta_geourl"
    t.string   "meta_copyright"
    t.string   "meta_keywords"
    t.text     "meta_description"
  end

  create_table "counters", :force => true do |t|
    t.integer "owner_id"
    t.string  "owner_type"
    t.string  "name",       :limit => 25
    t.integer "count",                    :default => 0
  end

  create_table "memberships", :force => true do |t|
    t.integer  "site_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "photos", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.string   "title"
    t.integer  "author_id"
    t.string   "author_type"
    t.string   "author_name",       :limit => 40
    t.string   "author_email",      :limit => 40
    t.string   "author_homepage"
    t.integer  "comment_age",                     :default => 0
    t.string   "cached_tag_list"
    t.datetime "published_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "parent_id"
    t.string   "data_file_name"
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.datetime "data_updated_at"
  end

  create_table "playlist_assets", :force => true do |t|
    t.integer "playlist_id"
    t.integer "asset_id"
  end

  create_table "playlists", :force => true do |t|
    t.string   "title"
    t.integer  "site_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "plugin_configs", :force => true do |t|
    t.string  "name"
    t.text    "options"
    t.integer "owner_id"
    t.string  "owner_type"
  end

  create_table "roles", :force => true do |t|
    t.integer "user_id"
    t.integer "context_id"
    t.string  "context_type"
    t.string  "type",         :limit => 25
  end

  create_table "section_translations", :force => true do |t|
    t.integer  "section_id"
    t.string   "locale"
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "section_translations", ["section_id"], :name => "index_section_translations_on_section_id"

  create_table "sections", :force => true do |t|
    t.string   "type"
    t.integer  "site_id"
    t.integer  "parent_id"
    t.integer  "lft",            :default => 0, :null => false
    t.integer  "rgt",            :default => 0, :null => false
    t.string   "path"
    t.string   "permalink"
    t.string   "title"
    t.string   "layout"
    t.string   "template"
    t.text     "options"
    t.integer  "contents_count"
    t.integer  "comment_age"
    t.string   "content_filter"
    t.text     "permissions"
    t.datetime "published_at"
  end

  create_table "sites", :force => true do |t|
    t.string  "name"
    t.string  "host"
    t.string  "title"
    t.string  "subtitle"
    t.string  "email"
    t.string  "timezone"
    t.string  "theme_names"
    t.text    "ping_urls"
    t.string  "akismet_key",                    :limit => 100
    t.string  "akismet_url"
    t.boolean "approve_comments"
    t.integer "comment_age"
    t.string  "comment_filter"
    t.string  "search_path"
    t.string  "tag_path"
    t.string  "tag_layout"
    t.string  "permalink_style"
    t.text    "permissions"
    t.text    "spam_options"
    t.string  "google_analytics_tracking_code"
    t.string  "meta_author"
    t.string  "meta_geourl"
    t.string  "meta_copyright"
    t.string  "meta_keywords"
    t.text    "meta_description"
    t.boolean "email_notification",                            :default => false
  end

  create_table "spam_reports", :force => true do |t|
    t.integer "subject_id"
    t.string  "subject_type"
    t.string  "engine"
    t.float   "spaminess"
    t.text    "data"
  end

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type"], :name => "index_taggings_on_taggable_id_and_taggable_type"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "theme_files", :force => true do |t|
    t.integer  "theme_id"
    t.string   "type"
    t.string   "name"
    t.string   "directory"
    t.string   "data_file_name"
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.datetime "data_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "themes", :force => true do |t|
    t.integer  "site_id"
    t.string   "name"
    t.string   "theme_id"
    t.string   "author"
    t.string   "version"
    t.string   "homepage"
    t.text     "summary"
    t.integer  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "topics", :force => true do |t|
    t.integer  "site_id"
    t.integer  "section_id"
    t.string   "title"
    t.integer  "sticky",           :default => 0
    t.boolean  "locked",           :default => false
    t.integer  "hits",             :default => 0
    t.integer  "last_post_id"
    t.integer  "last_author_id"
    t.string   "last_author_type"
    t.string   "last_author_name"
    t.string   "permalink"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "last_updated_at"
    t.integer  "board_id"
    t.integer  "author_id"
    t.string   "author_type"
  end

  create_table "url_history_entries", :force => true do |t|
    t.string  "url"
    t.text    "params"
    t.integer "resource_id"
    t.string  "resource_type"
  end

  create_table "users", :force => true do |t|
    t.string   "first_name",       :limit => 40
    t.string   "last_name",        :limit => 40
    t.string   "email",            :limit => 100
    t.string   "homepage"
    t.string   "about"
    t.string   "signature"
    t.string   "password_hash",    :limit => 40
    t.string   "password_salt",    :limit => 40
    t.string   "ip"
    t.string   "agent"
    t.string   "referer"
    t.string   "remember_me",      :limit => 40
    t.string   "token_key",        :limit => 40
    t.datetime "token_expiration"
    t.boolean  "anonymous",                       :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "verified_at"
    t.datetime "deleted_at"
    t.integer  "account_id"
  end

  add_index "users", ["account_id"], :name => "index_users_on_account_id"

end
