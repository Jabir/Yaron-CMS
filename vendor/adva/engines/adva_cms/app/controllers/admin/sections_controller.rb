class Admin::SectionsController < Admin::BaseController
  before_filter :set_section, :only => [:edit, :update, :destroy]
  before_filter :normalize_params, :only => :update_all

  cache_sweeper :section_sweeper, :only => [:create, :update, :destroy]
  guards_permissions :section, :update => :update_all

  def index
    @sections = @site.sections
  end
  
  def expand_node
    items = @site.sections.collect{|s| s if s.parent_id == params[:node].to_i }.compact.collect{|s| {:text => s.title, :url => admin_section_contents_path(s), :id => s.id, :leaf => false}}
    
    @section = @site.sections.find(params[:node].to_i)
    content_type = @section.class.content_type.pluralize.gsub('::', '_').underscore.downcase
    
    children = case content_type
      when "photos" then @section.photos.collect{|p| { :draggable => false, :text => p.title, :url => admin_section_contents_path(@section) + "#" + p.id.to_s, :leaf => true}}
      when "articles" then @section.articles.collect{|p| { :draggable => false, :text => p.title, :url => admin_section_contents_path(@section) + "#" + p.id.to_s, :leaf => true}}
      when "topics" then @section.topics.collect{|p| { :draggable => false, :text => p.title, :url => admin_section_contents_path(@section) + "#" + p.id.to_s, :leaf => true}}
      when "calendar_events" then @section.calendar_events.collect{|p| { :draggable => false, :text => p.title, :url => admin_section_contents_path(@section) + "#" + p.id.to_s, :leaf => true}}
      when "wikipages" then @section.wikipages.collect{|p| { :draggable => false, :text => p.title, :url => admin_section_contents_path(@section) + "#" + p.id.to_s, :leaf => true}}
    end
    
    children.each do |c|
      items.push c
    end
    
    render :json => items.to_json
  end

  def new
    @section = @site.sections.build(:type => Section.types.first)
  end

  def create
    @section = @site.sections.build params[:section]
    if @section.save
      flash[:notice] = t(:'adva.sections.flash.create.success')
      redirect_to (params[:commit] == t(:'adva.sections.links.save_and_create_new') ? new_admin_section_url : admin_section_contents_url(@section))
    else
      flash.now[:error] = t(:'adva.sections.flash.update.failure')
      render :action => "new"
    end
  end

  def edit
  end

  def update
    if @section.update_attributes params[:section]
      flash[:notice] = t(:'adva.sections.flash.update.success')
      redirect_to edit_admin_section_url(@site, @section)
    else
      flash.now[:error] = t(:'adva.sections.flash.update.failure')
      render :action => 'edit'
    end
  end

  def destroy
    if @section.destroy
      flash[:notice] = t(:'adva.sections.flash.destroy.success')
      redirect_to admin_sections_url
    else
      flash.now[:error] = t(:'adva.sections.flash.destroy.failure')
      render :action => 'edit'
    end
  end

  def update_all
    # FIXME we currently use :update_all to update the position for a single object
    # instead we should either use :update_all to batch update all objects on this
    # resource or use :update. applies to articles, sections, categories etc.
    # TODO add a after_move hook to better_nested_set
    # for now we can omit this because this action will only be called when
    # a section actually moves
    # moving = !(params[:sections].values.first.keys & ['left_id', 'parent_id']).empty?
    # TODO filter allowed attributes
    # TODO expire cache by site
    @site.sections.update(params[:sections].keys, params[:sections].values)
    @site.sections.update_paths!
    render :text => 'OK'
  end

  protected

    def set_menu
      @menu = Menus::Admin::Sections.new
    end

    def set_section
      @section = @site.sections.find(params[:id])
    end

    def normalize_params(hash = nil)
      hash ||= params
      hash.each do |key, value|
        if value.is_a? Hash
          hash[key] = normalize_params(value)
        elsif value == 'null'
          hash[key] = nil
        end
      end
      hash
    end
end
