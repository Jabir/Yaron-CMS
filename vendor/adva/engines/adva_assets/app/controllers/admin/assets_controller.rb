class Admin::AssetsController < Admin::BaseController
  include Admin::AssetsHelper
  helper :'admin/assets', :'admin/asset_tag'
  helper_method :created_notice, :destroyed_notice
  before_filter :set_assets, :only => [:index] # :set_filter_params, 
  before_filter :set_format, :only => [:create]
  before_filter :set_asset, :only => [:edit, :update, :destroy]

  guards_permissions :asset

  def index
    respond_to do |format|
      format.html
      format.js
      format.xml
    end
  end

  def new
    render :layout => false
  end

  def create
    @assets = @site.assets.build(params[:assets])
    @assets.each do |asset|
      asset.set_content_type
    end
    Asset.transaction { @assets.each &:save! }

    respond_to do |format|
      format.html do
        render :text => "OK"
        # flash[:notice] = created_notice
        # redirect_to admin_assets_url
      end
      format.js do
        responds_to_parent { render :action => 'create' }
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    respond_to do |format|
      format.html do
        render :text => t(:'adva.assets.flash.upload.failure')
        # flash[:error] = t(:'adva.assets.flash.upload.failure')
        # render :action => 'new'
      end
      format.js do
        responds_to_parent { render :action => 'flash_error' }
      end
    end
  rescue
    render :text => t(:'adva.assets.flash.upload.failure')
  end

  def edit
    render :layout => false
  end

  def update
    @asset.update_attributes! params[:asset]
    @asset.set_content_type
    @asset.save
    render :text => "OK"
    # flash[:notice] = t(:'adva.assets.flash.update.success')
    # redirect_to admin_assets_url
  rescue ActiveRecord::RecordInvalid
    render :text => t(:'adva.assets.flash.update.failure')
    # render :action => 'edit'
  end

  def destroy
    @asset.destroy
    (session[:bucket] || {}).delete(@asset.base_url)

    respond_to do |format|
      format.html do
        flash[:notice] = destroyed_notice
        redirect_to admin_assets_url
      end
      format.js do
      end
    end
  end

  protected

    def set_menu
      @menu = Menus::Admin::Assets.new
    end

    def set_assets
      params[:start] = 0 unless params.include?(:start)
      @current_page = params.include?(:limit) && params[:limit].to_i > 0 ? (params[:start].to_i / params[:limit].to_i)+1 : current_page

      if !(params.include?(:only))
        @assets = site.assets.filtered(params[:filters]).paginate(:per_page => params[:limit] || 24, :page => @current_page)
      else
        @assets = site.assets.filtered(params[:filters]).collect{|a| a if a.matches?(params[:only])}.compact.paginate(:per_page => params[:limit] || 24, :page => @current_page)
      end
    end

    def set_asset
      @asset = @site.assets.find(params[:id])
    end

    def set_format
      request.env['HTTP_ACCEPT'] = 'text/javascript,' + request.env['HTTP_ACCEPT']  if params[:respond_to_parent]
    end

    def created_notice
      # TODO: isn't the logic here backwards?
      @assets.size ?
        t(:'adva.assets.flash.create.first_success', :asset => CGI.escapeHTML(@assets.first.title) ) :
        t(:'adva.assets.flash.create.success', :count => @assets.size )
    end

    def destroyed_notice
      t(:'adva.assets.flash.delete.success', :asset => @asset.title)
    end
end
