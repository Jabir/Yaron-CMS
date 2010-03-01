class SearchController < BaseController
  def index
    @site = Site.find(params[:id])
    @section = params.include?(:section_id) ? Section.find(params[:section_id]) : @site.sections.first

    @search = Ultrasphinx::Search.new(
      :query => params[:q],
      :sort_mode => 'relevance'
    )
    
    @results = Array.new
    @search.results.each do |result|
      @results.push result if result.site_id == @site.id
    end
  end
  
  def calendar
    @t = Time.parse(params[:t])
    t_end = @t + 1.day
    
    @events = CalendarEvent.find(:all,
      :conditions => [
        "start_date <= ? and end_date >= ? and sections.site_id = ?",
        t_end,
        @t,
        params[:s]
      ],
      :include => :section
    )
    
    render :layout => false
  end
  
  def calendar_usage
    @t = Time.parse(params[:year]+params[:month].rjust(2,"0")+"01")
    @t_end = (@t + 1.month).at_beginning_of_month 
    @events = CalendarEvent.find(:all,
      :conditions => [
        "start_date <= ? and end_date >= ? and sections.site_id = ?",
        @t_end,
        @t,
        params[:s]
      ],
      :include => :section
    )
    
    render :layout => false
  end
  
  def by_tag
    @site = Site.find(params[:id])
    @section = @site.sections.first
    
    tag = params[:tag]
    
    @results = Article.find(:all, :include => [:taggings => :tag], :conditions => ["site_id = ? and tags.name = ?", @site.id, tag]) +
      Asset.find(:all, :include => [:taggings => :tag], :conditions => ["site_id = ? and tags.name = ?", @site.id, tag]) +
      CalendarEvent.find(:all, :include => [:section => [], :taggings => :tag], :conditions => ["site_id = ? and tags.name = ?", @site.id, tag])

  end
end

