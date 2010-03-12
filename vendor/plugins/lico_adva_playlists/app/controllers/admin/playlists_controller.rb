class Admin::PlaylistsController < Admin::BaseController
  # guards_permissions :playlist 

  def index
    @playlists = Playlist.find(:all, :conditions => ["site_id = ?", params[:site_id]])
  end
  
  def show
    @playlist = Playlist.find(params[:id])
  end
  
  def edit
    @playlist = Playlist.find(params[:id])
  end
  
  def create
    params[:playlist][:site_id] = params[:site_id]
    @playlist = Playlist.new(params[:playlist])
    if @playlist.save
      render :text => "OK"
    else
      render :action => 'new', :layout => false
    end
    
  end

  def update
    @playlist = Playlist.find(params[:id])
    render :layout => false and return unless @playlist.update_attributes(params[:playlist])
    @playlist.playlist_assets.each do |pa|
      if !(params.include?(:assets)) || !(params[:assets].include?(pa.asset_id.to_s))
        pa.destroy
      end
    end
    
    params[:assets].each do |assetid|
      assetid = assetid.to_i
      
      pa = PlaylistAsset.find_by_playlist_id_and_asset_id(@playlist.id, assetid)
      unless pa
        pa = PlaylistAsset.new(:playlist_id => @playlist.id, :asset_id => assetid)
        pa.save
      end
    end if params.include?(:assets)

    render :text => "CRUD_OK"
  end
  
  def destroy
    @playlist = Playlist.find(params[:id])
    @playlist.destroy
    render :text => ""
  end
  
  protected
    def set_menu
      @menu = Menus::Admin::Playlists.new
    end
end
