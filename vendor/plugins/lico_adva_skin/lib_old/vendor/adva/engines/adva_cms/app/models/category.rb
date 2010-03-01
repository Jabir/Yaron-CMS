class Category < ActiveRecord::Base
  acts_as_nested_set :scope => :section_id
  has_permalink :title, :url_attribute => :permalink, :sync_url => true, :only_when_blank => true, :scope => :section_id

  translates :title
  
  belongs_to :section, :foreign_key => 'section_id'
  has_many :articles
  has_many :contents, :through => :categorizations, :source => :categorizable, :source_type => 'Content'
  has_many :categorizations, :dependent => :delete_all
  
  before_save  :update_path
  after_create :update_paths

  validates_presence_of :section, :title
  validates_uniqueness_of :permalink, :scope => :section_id
  
  def owners
    owner.owners << owner
  end

  def owner
    section
  end
  
  def all_contents
    section.class.to_s == 'Album' ? scope_by_set : scope_by_content
  end
  
  protected
  
    def scope_by_set
      scope = Photo.scoped({})
      scope = scope.scoped :include => :sets, :conditions => ["categories.lft >= ? AND categories.rgt <= ?", lft, rgt]
      scope
    end
    
    def scope_by_content
      scope = Content.scoped({})
      scope = scope.scoped :include => :categories, :conditions => ["categories.lft >= ? AND categories.rgt <= ?", lft, rgt]
      scope = scope.scoped :conditions => ["contents.type = ?", section.class.content_type]
      scope = scope.scoped :include => :section, :conditions => ["sections.type = ?", section.class.to_s]
      scope
    end
  
    def update_path
      if permalink_changed?
        new_path = build_path
        unless self.path == new_path
          self.path = new_path
          @paths_dirty = true
        end
      end
    end

    # FIXME this is not hooked up. same in Section. don't we need to call this anyway?
    def update_child_paths
      if @paths_dirty
        self.all_children.each do |child|
          child.path = child.build_path
          child.save
        end
        @paths_dirty = false
      end
    end

    def build_path
      self_and_ancestors.map(&:permalink).join('/')
    end
    
    def update_paths
      if parent_id
        move_to_child_of(parent)
        section.categories.update_paths!
      end
    end
end
