class Admin::ConferencesController < Admin::BaseController
  before_filter :set_globals
  def set_globals
    @bigbluebutton = BigBlueButton.new({
      :username => 'admin@test.com',
      :password => 'admin',
      :host => 'http://84.244.143.166',
      :path_prefix => 'bigbluebutton'
    })
    @conference = @bigbluebutton.conference_by_name(@site.name, @site.id.to_s)
  end
  def index
  end
  
  def create
    new_params = {
      :name => params[:scheduled_session][:name].to_s,
      :description => '',
      :attendee_password => '',
      :moderator_password => '',
      :start => {
        :day => '',
        :month => '',
        :year => '',
        :hour => '',
        :minute => ''
      },
      :end => {
        :day => '',
        :month => '',
        :year => '',
        :hour => '',
        :minute => ''
      }
    }
    begin
      t = Time.parse(params[:scheduled_session][:start_datetime].to_s)
      new_params[:start] = {
       :day => t.day,
       :month => t.month,
       :year => t.year,
       :hour => t.hour,
       :minute => t.min,
      }
    rescue
    end
    begin
      t = Time.parse(params[:scheduled_session][:end_datetime].to_s)
      new_params[:end] = {
       :day => t.day,
       :month => t.month,
       :year => t.year,
       :hour => t.hour,
       :minute => t.min,
      }
    rescue
    end
    if @conference.add_scheduled_sessions new_params
      render :text => "CRUD_OK"
    else
      render :text => @conference.last_error
    end
  end
  
  def show
  end
  
  def update
    new_params = {
      :name => params[:scheduled_session][:name].to_s,
      :description => params[:scheduled_session][:description].to_s
    }
    
    new_params[:attendeePassword] = params[:scheduled_session][:attendee_password] if params[:scheduled_session].include?(:attendee_password)
    new_params[:moderatorPassword] = params[:scheduled_session][:moderator_password] if params[:scheduled_session].include?(:moderator_password)
    
    begin
      t = Time.parse(params[:scheduled_session][:start_datetime].to_s)
      new_params[:start] = {
       :day => t.day,
       :month => t.month,
       :year => t.year,
       :hour => t.hour,
       :minute => t.min,
      }
    rescue
    end if params[:scheduled_session].include?(:start_datetime)
    
    begin
      t = Time.parse(params[:scheduled_session][:end_datetime].to_s)
      new_params[:end] = {
       :day => t.day,
       :month => t.month,
       :year => t.year,
       :hour => t.hour,
       :minute => t.min,
      }
    rescue
    end if params[:scheduled_session].include?(:end_datetime)
    
    @conference.scheduled_sessions.each do |scheduled_session|
      if scheduled_session.id == params[:id]
        if scheduled_session.update_attributes(new_params)
          render :text => "CRUD_OK"
        else
          render :text => scheduled_session.last_error
        end
      end
    end
  end
  
  def destroy
    @conference.scheduled_sessions.each do |scheduled_session|
      scheduled_session.destroy if scheduled_session.id == params[:id]
    end
    render :text => "CRUD_OK"
  end
  
  # protected
  # 
  # def set_menu
  #   # @menu = Menus::Admin::Conference.new
  # end
end
