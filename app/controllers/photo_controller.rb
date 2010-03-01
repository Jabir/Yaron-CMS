class PhotoController < ApplicationController
  def new
    @section = Section.find params[:section]
    @site = @section.site

    if params.include?(:photo) &&
       params[:photo].include?(:data)
       
       params[:photo][:title] = File.basename(params[:photo][:data].original_filename) if params[:photo][:title].nil? || params[:photo][:title] == ""

       @photo = @section.photos.build(params[:photo])
       @photo.published_at = Time.now
       @photo.author = User.find(cookies["uid"])
       @photo.set_content_type

       if @photo.save
         flash[:notice] = "Upload toegevoegd!"
       else
         flash[:error] = @photo.errors.full_messages.to_s
       end
    else
      flash[:error] = 'Uploaden mislukt: Geen bestand gekozen'
    end
    
    redirect_to "/" + @section.path
  end
end
