require File.expand_path(File.dirname(__FILE__) + '/../test_helper')

class BlogCellTest < ActiveSupport::TestCase
  def setup
    super
    @controller   = CellTestController.new
    @cell         = BlogCell.new(@controller)
  end
  
  test "#recent_articles sets the articles from latest 5 articles, ordered by 'published_at DESC' as a default" do
    @cell.recent_articles
    @cell.instance_variable_get(:@articles).should == recent_articles
  end
  
  test "#recent_articles article amount can be altered by @opts[:count]" do
    @cell.instance_variable_set(:@opts, { :count => 1 })
    @cell.recent_articles
    @cell.instance_variable_get(:@articles).should == recent_articles("published_at DESC", 1)
  end
  
  # FIXME test the cached_references
  # FIXME test the has_state option
  
  def recent_articles(order = "published_at DESC", limit = 5)
    Article.all(:order => order, :limit => limit)
  end
end