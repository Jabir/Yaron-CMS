module Paperclip
  class AssetProcessor < Processor

    attr_accessor :time_offset, :geometry, :whiny

    def initialize(file, options = {})
      super
      ctype = (`file -Ib #{file.path} 2>/dev/null || file -ib #{file.path} 2>/dev/null`.gsub(/\n/,""))
      @is_image = /image/ =~ ctype || /pdf/ =~ ctype
      @is_video = !@is_image
      
      @create_thumb = options.include?(:geometry)
      @create_flv = !options.include?(:geometry)
      
      #
      # Video
      #
      if @is_video
        @file = file
        @basename = File.basename(file.path, File.extname(file.path))

        if @create_thumb
          @time_offset = options[:time_offset] || '-4'
          unless options[:geometry].nil? || (@geometry = Geometry.parse(options[:geometry])).nil?
            @geometry.width = (@geometry.width / 2.0).floor * 2.0
            @geometry.height = (@geometry.height / 2.0).floor * 2.0
            @geometry.modifier = ''
          end
          @whiny = options[:whiny].nil? ? true : options[:whiny]
        end
      end

      #
      # Afbeelding
      #
      if @is_image
        @file             = file
        @current_format   = File.extname(@file.path)
        @basename         = File.basename(@file.path, @current_format)
        @format           = options[:format]

        if @create_thumb
          geometry          = options[:geometry]
          @crop             = geometry[-1,1] == '#'
          @target_geometry  = Geometry.parse geometry
          @current_geometry = Geometry.from_file @file
          @convert_options  = options[:convert_options]
          @whiny            = options[:whiny].nil? ? true : options[:whiny]
        end
      end
    end

    # Returns true if the +target_geometry+ is meant to crop.
    def crop?
      @crop
    end
    
    # Returns true if the image is meant to make use of additional convert options.
    def convert_options?
      not @convert_options.blank?
    end

    # Returns the command ImageMagick's +convert+ needs to transform the image
    # into the thumbnail.
    def transformation_command
      scale, crop = @current_geometry.transformation_to(@target_geometry, crop?)
      trans = "-resize \"#{scale}\""
      trans << " -crop \"#{crop}\" +repage" if crop
      trans << " #{convert_options}" if convert_options?
      trans
    end

    def make
      if @create_thumb
        if @is_video
          dst = Tempfile.new([ @basename, 'jpg' ].compact.join("."))
          dst.binmode

          cmd = %Q[-itsoffset #{time_offset} -i "#{File.expand_path(@file.path)}" -y -vcodec mjpeg -vframes 1 -an -f rawvideo ]
          cmd << "-s #{geometry.to_s} " unless @geometry.nil?
          cmd << %Q["#{File.expand_path(dst.path)}"]

          `/usr/local/bin/ffmpeg #{cmd} >> #{RAILS_ROOT}/log/ffmpeg.log 2>> #{RAILS_ROOT}/log/production.log`
          # begin
          #   success = Paperclip.run('ffmpeg', cmd)
          # rescue PaperclipCommandLineError
          #   raise PaperclipError, "There was an error processing the thumbnail for #{@basename} (ffmpeg #{cmd})" if whiny
          # end
          return dst
        end

        if @is_image
          src = @file
          dst = Tempfile.new([@basename, @format, "jpg"].compact.join("."))
          dst.binmode

          command = <<-end_command
            "#{ File.expand_path(src.path) }[0]"
            #{ transformation_command }
            "#{ File.expand_path(dst.path) }"
          end_command

          begin
            success = Paperclip.run("convert", command.gsub(/\s+/, " "))
          rescue PaperclipCommandLineError
            raise PaperclipError, "There was an error processing the thumbnail for #{@basename}" if @whiny
          end

          return dst
        end
      end
      
      if @create_flv
        if @is_video
          dst = Tempfile.new([@basename, 'flv'].compact.join("."))
          dst.binmode

          cmd = %Q[-i "#{File.expand_path(@file.path)}" -y "#{File.expand_path(dst.path)}"]

          `/usr/local/bin/ffmpeg #{cmd} >> #{RAILS_ROOT}/log/ffmpeg.log 2>> #{RAILS_ROOT}/log/ffmpeg.log`
          # begin
          #   success = Paperclip.run('ffmpeg', cmd)
          # rescue PaperclipCommandLineError
          #   raise PaperclipError, "There was an error processing the thumbnail for #{@basename} (ffmpeg {#{cmd}})" if whiny
          # end
          return dst
        end
        if @is_image
          dst = Tempfile.new([@basename, @format].compact.join("."))
          File.copy(File.expand_path(@file.path), File.expand_path(dst.path))
          return dst
        end
        
      end
    end
 
  end
end