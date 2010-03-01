class Schedule < BigBlueButton
  attr_accessor :name, :description, :voice_conference_bridge, :link, :id, :last_error, :moderator_password, :attendee_password, :start_date_time, :end_date_time, :created_at, :updated_at
  
  def initialize(settings, id)
    @settings = settings
    @id = id
    
    schedule_details = get 'schedule/show/' + id
    
    @name = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Name/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @description = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Description/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @voice_conference_bridge = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Voice Conference Bridge/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @link = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Link/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip.gsub(/ .*$/,"")
    @moderator_password = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Moderator Password/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @attendee_password = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Attendee Password/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @start_date_time = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Start Date Time/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @end_date_time = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*End Date Time/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @created_at = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Date Created/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @updated_at = schedule_details.gsub(/[\r\n]/,"").gsub(/^.*Last Updated/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
  end
  
  def description=(name)
    @name = name if update_attribute(:name, name)
  end
  def description=(description)
    @description = description if update_attribute(:description, description)
  end
  
  def start_date_time=(start_date_time)
    update_attributes({
      :startDateTime_day => start_date_time[:day],
      :startDateTime_month => start_date_time[:month],
      :startDateTime_year => start_date_time[:year],
      :startDateTime_hour => start_date_time[:hour],
      :startDateTime_minute => start_date_time[:minute]
    })
  end

  def end_date_time=(end_date_time)
    update_attributes({
      :endDateTime_day => end_date_time[:day],
      :endDateTime_month => end_date_time[:month],
      :endDateTime_year => end_date_time[:year],
      :endDateTime_hour => end_date_time[:hour],
      :endDateTime_minute => end_date_time[:minute]
    })
  end
  
  def moderator_password=(moderator_password)
    @moderator_password = moderator_password if update_attribute(:moderatorPassword, moderator_password)
  end
  
  def attendee_password=(attendee_password)
    @attendee_password = attendee_password if update_attribute(:attendeePassword, attendee_password)
  end
  
  def update_attributes(attributes)
    if attributes.include?(:start) && attributes[:start].is_a?(Hash)
      attributes[:startDateTime_day] = attributes[:start][:day]
      attributes[:startDateTime_month] = attributes[:start][:month]
      attributes[:startDateTime_year] = attributes[:start][:year]
      attributes[:startDateTime_hour] = attributes[:start][:hour]
      attributes[:startDateTime_minute] = attributes[:start][:minute]
    end
    if attributes.include?(:end) && attributes[:end].is_a?(Hash)
      attributes[:endDateTime_day] = attributes[:end][:day]
      attributes[:endDateTime_month] = attributes[:end][:month]
      attributes[:endDateTime_year] = attributes[:end][:year]
      attributes[:endDateTime_hour] = attributes[:end][:hour]
      attributes[:endDateTime_minute] = attributes[:end][:minute]
    end
    data =  post('schedule/index', attributes.merge({
      :id => @id,
      :_action_Update => 'Update'
    }))
    
    @last_error = /<div class="errors">/ =~ data ? '<div class="errorExplanation">' + data.gsub(/[\r\n]/,"").split("<div class=\"errors\">")[1].split("</div>")[0].split("<li>").collect{|li| /<\/li>/ =~ li ? li.gsub(/<\/li>.*$/,"") : nil}.compact.join("<br />") + "</div>" : ""
    
    /ScheduledSession \d* updated/ =~ data
  end
  
  def update_attribute(attribute, value)
    update_attributes({attribute => value})
  end
  
  def destroy
    post('schedule/index', {
      :id => @id,
      :_action_Delete => 'Delete'
    })
  end
end