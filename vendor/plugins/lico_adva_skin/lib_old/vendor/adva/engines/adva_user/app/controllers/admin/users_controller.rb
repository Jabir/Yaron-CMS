class Admin::UsersController < Admin::BaseController
  include Admin::UsersHelper

  before_filter :set_users, :only => [:index]
  before_filter :set_user,  :only => [:show, :edit, :update, :destroy]
  before_filter :authorize_access
  before_filter :authorize_params, :only => :update
  filter_parameter_logging :password

  guards_permissions :user#, :manage => [:list,:update]

  def index
  end
  
  def list
    if @site
      @total_amount = @site.users.length
      options = {
        :page => 1 + (params[:start].to_i / params[:limit].to_i),
        :per_page => params[:limit],
        :order => "last_name asc"
      }
      @users = @site.users.filtered(params[:filters]).paginate options
      render :content_type => 'text/xml'
    else
      @total_amount = User.count(:all)
      options = {
        :page => 1 + (params[:start].to_i / params[:limit].to_i),
        :per_page => params[:limit],
        :order => "last_name asc"
      }
      # @users = User.filtered(params[:filters]).paginate options
      @users = User.paginate options
      render :content_type => 'text/xml'
    end
  end

  def show
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    @user.memberships.build(:site => @site) if @site and !@user.has_role?(:superuser)

    if @user.save
      @user.verify! # TODO hu??
      trigger_events(@user)
      flash[:notice] = t(:'adva.users.flash.create.success')
      if request.xhr?
        render :text => "ok"
      else
        redirect_to admin_user_url(@site, @user)
      end
    else
      flash.now[:error] = t(:'adva.users.flash.create.failure')
      if request.xhr?
        render :action => 'submit_errors', :layout => false
      else
        render :action => :new
      end
    end
  end

  def edit
  end

  def update
    if @user.update_attributes(params[:user])
      trigger_events @user
      flash[:notice] = t(:'adva.users.flash.update.success')
      if request.xhr?
        render :text => "ok"
      else
        redirect_to admin_user_url(@site, @user)
      end
    else
      flash.now[:error] = t(:'adva.users.flash.update.failure')
      if request.xhr?
        render :action => 'submit_errors', :layout => false
      else
        render :action => :edit
      end
    end
  end

  def destroy
    if @user.destroy
      trigger_events @user
      flash[:notice] = t(:'adva.users.flash.destroy.success')
      redirect_to admin_users_url(@site)
    else
      flash.now[:error] = t(:'adva.users.flash.destroy.failure')
      render :action => :edit
    end
  end

  private

    def set_menu
      @menu = Menus::Admin::Users.new
    end

    def set_users
      @users = @site ? @site.users_and_superusers.paginate(:page => current_page) :
                       User.admins_and_superusers.paginate(:page => current_page)
    end

    def set_user
      options = @site ? {:include => [:roles, :memberships], :conditions => ['memberships.site_id = ? OR roles.type = ?', @site.id, 'Rbac::Role::Superuser']} : {}
      @user = User.find params[:id], options
    rescue
      flash[:error] = t(:'adva.users.flash.not_member_of_this_site')
      redirect_to admin_users_url(@site)
    end

    def authorize_access
      redirect_to admin_sites_url unless @site || current_user.has_role?(:superuser)
    end

    def authorize_params
      return
      return unless params[:user] && params[:user][:roles]

      if params[:user][:roles].has_key?('superuser') && !current_user.has_role?(:superuser) ||
         params[:user][:roles].has_key?('admin') && !current_user.has_role?(:admin, :context => @site)
        raise "unauthorized parameter" # TODO raise something more meaningful
      end
      # TODO as well check for membership site_id if !user.has_role?(:superuser)
    end
end
