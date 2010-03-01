Paperclip::Attachment.interpolations.merge! \
  :asset_file_url  => proc { |data, style| data.instance.url(style)  },
  :asset_file_path => proc { |data, style| data.instance.path(style) }

Paperclip::Attachment.interpolations[:content_type_extension] = proc do |attachment, style_name|
  case
    when ((style = attachment.styles[style_name]) && !style[:format].blank?) then style[:format]
    when attachment.instance.video? && style_name.to_s == 'transcoded' then 'flv'
    when attachment.instance.video? && style_name.to_s != 'original' then 'jpg'
  else
    File.extname(attachment.original_filename).gsub(/^\.+/, "")
  end
end
# FIXME how to tell paperclip to only create thumbnails etc from images?

require 'has_filter'

class Asset < ActiveRecord::Base
  cattr_accessor :root_dir
  @@root_dir = "#{RAILS_ROOT}/public"

  # used for recognizing exceptional mime types
  @@content_types = {
    :image => [],
    :audio => ['application/ogg', 'application/x-wav'],
    :video => ['application/x-shockwave-flash', 'application/x-mov'],
    :pdf   => ['application/pdf', 'application/x-pdf']
  }
  cattr_reader :content_types

  # do we really want this? or do we want to just overwrite existing assets
  # instead? or even add a config option?
  before_save :ensure_unique_filename

  belongs_to :site
  has_many :contents, :through => :asset_assignments
  has_many :asset_assignments, :order => 'position', :dependent => :delete_all
  acts_as_taggable
  
  has_filter :tagged, :text => { :attributes => [:data_file_name, :title] }

  has_attached_file :data, :styles => { :normal => { }, :medium => "300x300>", :bandera => "250x315#", :thumb => "120x120#", :tiny => "50x50#", :glider => "240x160#", :glider_thumb => "75x75#" },
                           :url    => ":asset_file_url",
                           :path   => ":asset_file_path",
                           :default_style => :normal,
                           :processors => [:asset_processor]
     
  validates_presence_of :site_id
  validates_attachment_presence :data
  validates_attachment_size :data, :less_than => 1024.megabytes

  named_scope :is_media_type, lambda { |types|
    content_type_conditions(types)
  }

  # no idea where these would ever be used?
  content_types.keys.each do |type|
    named_scope type.to_s.pluralize, lambda {
      content_type_conditions(type)
    }
  end
  named_scope :others, lambda {
    content_type_conditions(content_types.keys - [:pdf], :exclude => true )
  }
  
  has_many :playlist_assets, :dependent => :destroy
  
  def set_content_type
    begin
      if self.content_type.nil? || self.content_type == "" || self.content_type == "application/octet-stream"
        temp_path = self.data.queued_for_write[:normal].path.to_s
        self.content_type = (`file -Ib #{temp_path} 2>/dev/null || file -ib #{temp_path} 2>/dev/null`.gsub(/\n/,"")).gsub(/\;.*/,"")
        self.data_content_type = self.content_type
      end
    
      if temp_path && matches?(:movie)
        self.duration = (`ffmpeg -i #{temp_path} 2>&1 | grep duration | grep -v total | cut -d ':' -f 2 | sed s/\\ //`.gsub(/\n/,""))
      end
    rescue
    end
  end
  
  def css_class
    return "pdf" if matches?(:pdf)
    return "movie" if matches?(:movie)
    return "image"
  end
  def matches?(what)
    if what.to_sym == :pdf
      return ['application/pdf', 'application/x-pdf'].include?(data.instance.data_content_type)
    end
    if what.to_sym == :movie
      return [
            'application/octet-stream',
            'application/x-mp4',
            'video/mpeg',
            'video/quicktime',
            'video/x-la-asf',
            'video/x-ms-asf',
            'video/x-msvideo',
            'video/x-sgi-movie',
            'video/x-flv',
            'flv-application/octet-stream',
            'video/3gpp',
            'video/3gpp2',
            'video/3gpp-tt',
            'video/BMPEG',
            'video/BT656',
            'video/CelB',
            'video/DV',
            'video/H261',
            'video/H263',
            'video/H263-1998',
            'video/H263-2000',
            'video/H264',
            'video/JPEG',
            'video/MJ2',
            'video/MP1S',
            'video/MP2P',
            'video/MP2T',
            'video/mp4',
            'video/MP4V-ES',
            'video/MPV',
            'video/mpeg4',
            'video/mpeg4-generic',
            'video/nv',
            'video/parityfec',
            'video/pointer',
            'video/raw',
            'video/rtx' ].include?(data.instance.data_content_type)
    end
  end

  class << self
    def base_url(site)
      "/sites/site-#{site.id}/assets"
    end

    def base_dir(site)
      "#{root_dir}/sites/site-#{site.id}/assets"
    end
    
    [:image, :video, :audio, :pdf, :other].each do |type|
      define_method("#{type}?") do |content_type|
        Mime::Type.lookup(content_type).to_s.starts_with(type.to_s) ||
          content_types[type].try(:include?, content_type) || false
      end
    end

    def other?(content_type)
      ![:image, :video, :audio, :pdf].any? { |type| send(:"#{type}?", content_type) }
    end

    protected

      def content_type_conditions(types, options = {})
        types = Array(types)
        operator, negator = options[:exclude] ? [' AND ', 'NOT '] : [' OR ', nil]

        patterns = types.map { |type| "#{type}%" }
        types    = types.map &:to_sym
        values   = content_types.slice(*types).values.flatten
        query    = ["data_content_type #{negator}IN (?)"] +
                   [" data_content_type #{negator}LIKE ?"] * types.size

        { :conditions => [query.join(operator), values, *patterns] }
      end
  end

  def title
    t = read_attribute(:title)
    t.present? ? t : data_file_name
  end

  [:image, :video, :audio, :pdf, :other].each do |type|
    define_method("#{type}?") { self.class.send("#{type}?", data_content_type) }
  end

  def base_url(style = :original, fallback = false)
    style = :original unless style == :original or File.exists?(path(style))
    [self.class.base_url(self.site), filename(style)].to_path
  end

  def path(style = :original)
    [self.class.base_dir(site), filename(style)].to_path
  end

  def filename(style = :original)
    style == :original ? data_file_name : [basename, style, extname].to_path('.')
  end

  def basename
    data_file_name.gsub(/\.#{extname}$/, "")
  end

  def extname
    File.extname(data_file_name).gsub(/^\.+/, '')
  end

  protected

    def ensure_unique_filename
      if new_record? || changes['data_file_name']
        basename, extname = self.basename, self.extname
        i = extname =~ /^\d+\./ ? $1 : 1
        while File.exists?(path)
          self.data_file_name = [basename, i, extname].to_path('.')
          i += 1
        end
      end
    end
end
