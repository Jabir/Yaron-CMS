require 'html_diff'

class Content < ActiveRecord::Base
  # TODO is this needed?
  class Version < ActiveRecord::Base
    filters_attributes :none => true
  end
    
  translates :title, :body, :excerpt, :body_html, :excerpt_html, 
    :versioned  => [ :title, :body, :excerpt, :body_html, :excerpt_html ], 
    :if_changed => [ :title, :body, :excerpt ], :limit => 5
  acts_as_taggable

  instantiates_with_sti
  has_permalink :title, :url_attribute => :permalink, :sync_url => true, :only_when_blank => true, :scope => :section_id
  filtered_column :body, :excerpt

  belongs_to :site
  belongs_to :section
  belongs_to :category
  belongs_to_author :validate => true

  has_many :assets, :through => :asset_assignments
  has_many :asset_assignments # TODO :dependent => :delete_all?
  has_many :activities, :as => :object # move to adva_activity?
  has_many :categories, :through => :categorizations
  has_many :categorizations, :as => :categorizable, :dependent => :destroy, :include => :category

  before_validation :set_site
  
  # more explicit to make nested category contents to work
  default_scope :order => 'contents.position, contents.published_at'

  named_scope :published, Proc.new { |*args|
    options = args.extract_options!
    conditions = ['contents.published_at IS NOT NULL AND contents.published_at <= ?', Time.zone.now]
    add_time_delta_condition!(conditions, args) unless args.compact.empty?
    options.merge :conditions => conditions 
  }
  
  named_scope :drafts, Proc.new { |*args|
    options = args.extract_options!
    conditions = ['contents.published_at IS NULL']
    add_time_delta_condition!(conditions, args) unless args.compact.empty?
    options.merge :conditions => conditions
  }
  
  named_scope :unpublished, Proc.new { |*args|
    drafts(*args).scope(:find)
  }
  
  class << self
    def add_time_delta_condition!(conditions, args)
      conditions.first << " AND contents.published_at BETWEEN ? AND ?"
      conditions.concat Time.delta(*args)
    end
  end
  
  def owners
    owner.owners << owner
  end

  def owner
    section
  end

  def attributes=(attrs, guard_protected_attributes = true)
    if attrs.delete(:draft).to_i == 1
      attrs = attrs.reject { |k, v| k.to_s =~ /^published_at.+/ } 
      self.published_at = nil
    end
    # FIXME this is only needed because belongs_to_cacheable can't be non-polymorphic, yet
    begin
      self.author = User.find(attrs[:author_id]) if attrs[:author_id] && attrs[:author_id]!=""
    rescue
    end

    category_ids = attrs.delete(:category_ids)
    returning super do 
      update_categories category_ids.reject(&:blank?) if category_ids 
    end
  end

  def published_month
    Time.local published_at.year, published_at.month, 1
  end

  def draft?
    published_at.nil?
  end

  def pending?
    !published?
  end

  def published?
    !published_at.nil? and published_at <= Time.zone.now
  end

  def published_at?(date)
    published? and date == [:year, :month, :day].map {|key| published_at.send(key).to_s }
  end

  def state
    pending? ? :pending : :published
  end
  
  def just_published?
    published? and published_at_changed?
  end

  def diff_against_version(version)
    # return '(orginal version)' if version == versions.earliest.version
    version = versions[version]
    HtmlDiff.diff version.excerpt_html + version.body_html, excerpt_html + body_html
  end

  # def to_param(key)
  #   value = if self.respond_to?(key)
  #     self.send(key)
  #   elsif [:year, :month, :day].include?(key)
  #     published_at.send(key)
  #   else
  #     super()
  #   end
  #   value ? value.to_s : nil
  # end
  
  protected

    def set_site
      self.site_id = section.site_id if section
    end

    def update_categories(category_ids)
      categories.each do |category|
        category_ids.delete(category.id.to_s) || categories.delete(category)
      end
      unless category_ids.blank?
        categories << Category.find(:all, :conditions => ['id in (?)', category_ids])
      end
    end
end