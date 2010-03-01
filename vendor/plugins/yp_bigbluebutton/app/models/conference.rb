class Conference < BigBlueButton
  attr_accessor :name, :number, :created_at, :updated_at, :id, :last_error
  
  def initialize(settings, id)
    @settings = settings
    @id = id

    conference_details = get 'conference/show/' + id
    
    @name = conference_details.gsub(/[\r\n]/,"").gsub(/^.*Conference Name/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @number = conference_details.gsub(/[\r\n]/,"").gsub(/^.*Conference Number/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @created_at = conference_details.gsub(/[\r\n]/,"").gsub(/^.*Date Created/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
    @updated_at = conference_details.gsub(/[\r\n]/,"").gsub(/^.*Last Updated/,"").split("<td")[1].split("</td>")[0].gsub(/^[^>]*\>/,"").strip
  end
  
  def name=(name)
    @name = name if update_attribute(:name, name)
  end

  def number=(number)
    @number = number if update_attribute(:conferenceNumber, number)
  end
  
  def update_attributes(attributes)
    data =  post('conference/index', attributes.merge({
      :id => @id,
      :_action_Update => 'Update'
    }))
    
    @last_error = /<div class="errors">/ =~ data ? '<div class="errorExplanation">' + data.gsub(/[\r\n]/,"").split("<div class=\"errors\">")[1].split("</div>")[0].split("<li>").collect{|li| /<\/li>/ =~ li ? li.gsub(/<\/li>.*$/,"") : nil}.compact.join("<br />") + "</div>" : ""
    
    /The conference has been updated/ =~ data
  end
  
  def update_attribute(attribute, value)
    update_attributes({attribute => value})
  end
  
  def destroy
    post('conference/index', {
      :id => id,
      :_action_Delete => 'Delete'
    })
  end
  
  def add_scheduled_sessions params
    data = post('schedule/save', {
      :conferenceId => @id,
      :name => params[:name],
      :description => params[:description],
      :startDateTime_day => params[:start][:day],
      :startDateTime_month => params[:start][:month],
      :startDateTime_year => params[:start][:year],
      :startDateTime_hour => params[:start][:hour],
      :startDateTime_minute => params[:start][:minute],
      :endDateTime_day => params[:end][:day],
      :endDateTime_month => params[:end][:month],
      :endDateTime_year => params[:end][:year],
      :endDateTime_hour => params[:end][:hour],
      :endDateTime_minute => params[:end][:minute],
      :attendeePassword => params[:attendee_password],
      :moderatorPassword => params[:moderator_password]
    })
    
    @last_error = /<div class="errors">/ =~ data ? '<div class="errorExplanation">' + data.gsub(/[\r\n]/,"").split("<div class=\"errors\">")[1].split("</div>")[0].split("<li>").collect{|li| /<\/li>/ =~ li ? li.gsub(/<\/li>.*$/,"") : nil}.compact.join("<br />") + "</div>" : ""
    
    /ScheduledSession \d* created/ =~ data
  end
  
  def scheduled_sessions
    schedules = get 'conference/show/' + @id.to_s
    
    schedules.gsub(/[\r\n]/,"").gsub(/^.*<div class="list">/,"").gsub(/^.*<tbody>/,"").gsub(/<\/tbody>.*$/,"").split("<tr").collect { |schedule|
      next unless /\S/ =~ schedule
      
      id = schedule.gsub(/^.*schedule\/show\/(\d*).*$/,"\\1")
      Schedule.new(@settings, id)
    }.compact
    
  end
end