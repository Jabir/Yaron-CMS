require 'pp'
require 'net/http'
require 'cgi'

class BigBlueButton
  
  def initialize(settings)
    @settings = settings
  end
  
  def conferences
    conferences = get ''
    conferences.gsub(/[\r\n]/,"").gsub(/^.*<div class="list">/,"").gsub(/^.*<tbody>/,"").gsub(/<\/tbody>.*$/,"").split("<tr").collect { |conference|
      next unless /\S/ =~ conference
      
      id = conference.gsub(/^.*conference\/show\/(\d*).*$/,"\\1")
      Conference.new(@settings, id)
    }.compact
  end
  
  def conference_by_name name, number
    @conference = nil
    conferences.each do |conference|
      @conference = conference if conference.name == name && conference.number == number
    end
    if @conference.nil?
      add_conference({ :name => name, :number => number })
      conferences.each do |conference|
        @conference = conference if conference.name == name && conference.number == number
      end
      return @conference
    else
      return @conference
    end
  end
  
  def add_conference params
    /You have successfully created a conference/ =~ post('conference/save', {
      :name => params[:name],
      :conferenceNumber => params[:number],
    })
  end
  
  private
  
  def sign_in
    @uri = URI.parse(@settings[:host])
    @http = Net::HTTP.new @uri.host, @uri.port

    data = post('auth/signIn', {
      :username => @settings[:username],
      :password => @settings[:password]
    })
    
    if /<div class="message">Invalid username and\/or password<\/div>/ =~ data
      @http = nil
      puts "> Invalid username and/or password"
      return false
    else
      return data
    end
  end
  
  def parse_url url
    parsed = URI.parse(url)
    unless parsed.host.nil?
      url #parsed.path + "?" + parsed.query
    else
      "/"+@settings[:path_prefix]+'/' + url
    end
  end
  
  def post url, params
    sign_in unless @http
    
    url = parse_url url

    params = params.to_a.collect!{|p| p[0].to_s+"="+CGI::escape(p[1].to_s) }.join("&")

    puts "POST " + url + " " + params
    
    response, data = @http.post(url, params, { 'Cookie' => @cookie.to_s })
    @cookie = response.response['set-cookie'].gsub(/path=\/,?/,"") if response.response && response.response['set-cookie']

    case response
      when Net::HTTPSuccess then data
      when Net::HTTPRedirection then get(response['location'])
    else
      data
      # response.error!
    end
  end
  
  def get url
    sign_in unless @http
    
    url = parse_url url

    puts "GET " + url
    response, data = @http.get(url, { 'Cookie' => @cookie.to_s })
    @cookie = response.response['set-cookie'].gsub(/path=\/,?/,"") if response.response && response.response['set-cookie']
    
    case response
      when Net::HTTPSuccess then data
      when Net::HTTPRedirection then get(response['location'])
    else
      data
      # response.error!
    end
  end
end
