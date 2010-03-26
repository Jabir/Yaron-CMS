class Admin::TopicsController < Admin::BaseController
  helper :forum
  before_filter :set_section
  cache_sweeper :topic_sweeper, :only => [:create, :update, :destroy]
  caches_page_with_references :show, :track => ['@topic', '@posts', {'@topic' => :posts_count}]

  # guards_permissions :topic

  def index
    @topics = @section.topics.all(:include => :board, :order => 'topics.last_updated_at DESC, topics.id DESC')
  end
  
  def edit
    @topic = @section.topics.find(params[:id])
  end
  
  def create
    @topic = @section.topics.build(params[:topic])
    @topic.author = User.find(session[:uid])
    if @topic.save
      render :text => "CRUD_OK"
    else
      render :action => "new"
    end
  end

  def update
    @topic = @section.topics.find(params[:id])
    if @topic.update_attributes(params[:topic])
      render :text => "CRUD_OK"
    else
      render :action => "new"
    end
  end
  
  def destroy
    @topic = @section.topics.find(params[:id])
    if @topic.destroy
      render :text => "OK"
    else
      render :action => "new"
    end
  end
  
  protected
  
    def set_menu
      @menu = Menus::Admin::Topics.new
    end
end