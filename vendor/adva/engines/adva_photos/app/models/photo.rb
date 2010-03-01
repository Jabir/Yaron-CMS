Paperclip::Attachment.interpolations.merge! \
  :photo_file_url  => proc { |data, style| data.instance.url(style)  },
  :photo_file_path => proc { |data, style| data.instance.path(style) }

Paperclip::Attachment.interpolations[:content_type_extension] = proc do |attachment, style_name|
  case
    when ((style = attachment.styles[style_name]) && !style[:format].blank?) then style[:format]
    when attachment.instance.video? && style_name.to_s == 'transcoded' then 'flv'
    when attachment.instance.video? && style_name.to_s != 'original' then 'jpg'
  else
    File.extname(attachment.original_filename).gsub(/^\.+/, "")
  end
end

Category.class_eval do
  has_many :photos, :through => :categorizations, :source => :categorizable, :source_type => 'Photo'
end

class Photo < ActiveRecord::Base
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

  acts_as_taggable

  belongs_to_author
  belongs_to :section
  has_many :sets, :source => 'category', :through => :categorizations
  has_many :categorizations, :as => :categorizable, :dependent => :destroy, :include => :category

  has_attached_file :data, :styles => { :normal => { }, :large => "600x600>", :thumb => "120x120>", :tiny => "50x50#" },
                           :url    => ":photo_file_url",
                           :path   => ":photo_file_path",
                           :default_style => :normal,
                           :processors => [:asset_processor]

  default_scope :order => 'published_at desc'

  named_scope :published, lambda {
    { :conditions => ['published_at IS NOT NULL AND published_at <= ?', Time.zone.now] } }

  named_scope :drafts, lambda {
    { :conditions => ['published_at IS NULL'] } }

  named_scope :by_set, lambda { |set|
    {
      :include => :sets,
      :conditions => ["categories.lft >= ? AND categories.rgt <= ?", set.lft, set.rgt]
    }
  }

  before_save :ensure_unique_filename

  validates_presence_of :title
  validates_attachment_presence :data
  validates_attachment_size :data, :less_than => 30.megabytes

  def set_content_type
    if self.data_content_type.nil? || self.data_content_type == "" || self.data_content_type == "application/octet-stream"
      temp_path = self.data.queued_for_write[:normal].path.to_s
      self.data_content_type = (`file -Ib #{temp_path} 2>/dev/null || file -ib #{temp_path} 2>/dev/null`.gsub(/\n/,"")).gsub(/\;.*/,"")
    end
    
    if temp_path && matches?(:movie)
      self.duration = (`ffmpeg -i #{temp_path} 2>&1 | grep duration | grep -v total | cut -d ':' -f 2 | sed s/\\ //`.gsub(/\n/,""))
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
      "/sites/site-#{site.id}/photos"
    end

    def base_dir(site)
      "#{root_dir}/sites/site-#{site.id}/photos"
    end
  end

  def draft?
    published_at.nil?
  end

  def published?
    !published_at.nil? and published_at <= Time.zone.now
  end

  def pending?
    !published?
  end

  def state
    pending? ? :pending : :published
  end

  def base_url(style = :original, fallback = false)
    style = :original unless style == :original or File.exists?(path(style))
    [self.class.base_url(site), filename(style)].to_path
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

  def site
    section.site
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