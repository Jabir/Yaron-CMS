class Admin::PostsController < Admin::BaseController
  helper :forum
  before_filter :set_section
  cache_sweeper :post_sweeper, :only => [:create, :update, :destroy]

  def index
    @posts = @section.posts.all
  end
  
  def edit
    @post = @section.posts.find(params[:id])
  end
  
  def create
    if params.include?(:post) && params[:post].include?(:commentable_id) && !params[:post][:commentable_id].nil?
      @topic = Topic.find(params[:post][:commentable_id])
      @post = @topic.reply current_user, params[:post]
      @post.author = User.find(session[:uid])
    else
      @post = @section.posts.build(params[:post])
    end
    if @post.save
      render :text => "CRUD_OK"
    else
      render :action => "new"
    end
  end
  
  def update
    @post = @section.posts.find(params[:id])
    if @post.update_attributes(params[:post])
      render :text => "CRUD_OK"
    else
      render :action => "new"
    end
  end
  
  def destroy
    @post = @section.posts.find(params[:id])
    if @post.destroy
      render :text => "OK"
    else
      render :action => "new"
    end
  end
   
  protected
  
    def set_menu
      @menu = Menus::Admin::Posts.new
    end
end