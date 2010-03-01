require 'pp'
require 'ftools'

namespace :lico do
  namespace :adva do
    #
    # Voor de section "home" moet single_article_mode op
    # false staan, zodat we een lijst van artikelen kunnen
    # laten zien (i.p.v. een edit-scherm van het eerste
    # artikel).
    #
    desc "Update site configuration for usage with lico_adva_skin"
    task :prepare => :environment do
      # puts "- Updating single article mode in home section of each site..."
      # Site.find(:all).each do |site|
      #   puts "> #{site.name}"
      #   site.sections.find(:all, :conditions => ["title = ?","Home"]).each do |section|
      #     puts "  > #{section.type} > #{section.title}"
      #     if section.single_article_mode
      #       puts "    > Single article mode: " + section.single_article_mode.to_s + " (NEEDS CHANGING)"
      #       puts "    > Disabling single article mode..."
      #       section.single_article_mode = false
      #       section.save
      #     else
      #       puts "    > Single article mode: " + section.single_article_mode.to_s + " (OK)"
      #     end
      #   end
      # end

      puts "\n- Installing adva_meta_tag plugin"
      if File.exists?(File.join(File.dirname(__FILE__),"..","..","adva_meta_tags"))
        puts "  > meta_tag plugin already installed"
      else
        File.symlink("../adva/plugins/adva_meta_tags", File.join(RAILS_ROOT,"vendor","plugins","adva_meta_tags"))
        puts "  > meta_tag installed (OK), please db:migrate..."
      end
    end
  
    desc "Install lico_adva_skin"
    task :install => :environment do
      if File.exists?(File.join(backup_path,"app")) || File.exists?(File.join(backup_path,"vendor"))
        puts "LICO Adva skin already installed..."
        exit 1
      else
        Rake::Task["lico:adva:prepare"].execute
        puts "\n- Installing lico_adva_skin"
        install_skin
      end
    end
  
    desc "Uninstall lico_adva_skin and restore adva cms"
    task :uninstall do
      if !File.exists?(File.join(backup_path,"app")) && !File.exists?(File.join(backup_path,"vendor"))
        puts "LICO Adva skin not installed..."
        exit 1
      else
        puts "\n- Removing lico_adva_skin"
        uninstall_skin
        restore_backup
      end
    end
    
    desc "Update lico_adva_skin"
    task :update => :environment do
      Rake::Task["lico:adva:uninstall"].execute
      system('svn update ' + File.join(File.dirname(__FILE__),".."))
      Rake::Task["lico:adva:install"].execute
    end
  end
end

def backup_path
  File.join File.dirname(__FILE__), "..", "backup"
end
def source_path
  File.join(File.dirname(__FILE__),"..","lib")
end
def target_path
  RAILS_ROOT
end

def install_skin(path = "")
  Dir.glob(File.join(source_path,path,"*")).each do |entry|
    entry = entry.gsub(source_path,"").gsub(/^\//,"")

    if File.directory?(File.join(source_path, entry))
      #
      # 1) Map bestat al => gewoon verder
      #
      if File.exists?(File.join(target_path,entry))
        install_skin(entry)
      end
      
      #
      # 2) Map bestat nog niet => Aanmaken
      #
      if !File.exists?(File.join(target_path,entry))
        puts " > Creating " + entry
        File.makedirs(File.join(target_path,entry))
        install_skin(entry)
      end
    else
      #
      # 1) Bestand bestaat al => Backup + aanmaken
      #
      if File.exists?(File.join(target_path,entry))
        puts " > Creating backup for " + entry
        File.makedirs(File.join(backup_path, File.dirname(entry)))
        File.copy(File.join(source_path,entry), File.join(backup_path, entry))
        File.unlink(File.join(target_path,entry))
      end
      #
      # 2) Bestand bestaat nog niet => Aanmaken
      #
      if !File.exists?(File.join(target_path,entry))
        puts " > Creating " + entry
        File.copy(File.join(source_path,entry), File.join(target_path, entry))
      end
      
    end
  end
end

def uninstall_skin(path = "")
  Dir.glob(File.join(source_path,path,"*")).each do |entry|
    entry = entry.gsub(source_path,"").gsub(/^\//,"")

    if File.directory?(File.join(target_path, entry))
      #
      # Eerst inhoud wissen
      #
      uninstall_skin(entry)
      
      #
      # Map bestat nog => wissen
      #
      if File.exists?(File.join(target_path,entry))
        begin
          puts " > Removing " + entry
          Dir.rmdir(File.join(target_path,entry))
        rescue
        end
      end
    else
      #
      # Bestand bestaat nog => verwijderen
      #
      if File.exists?(File.join(target_path,entry))
        puts " > Removing " + entry
        File.unlink(File.join(target_path,entry))
      end
    end
  end
end

def restore_backup(path = "")
  Dir.glob(File.join(backup_path,path,"*")).each do |entry|
    entry = entry.gsub(backup_path,"").gsub(/^\//,"")
  
    if File.directory?(File.join(backup_path,entry))
      restore_backup entry
      begin
        Dir.rmdir File.join(backup_path,entry)
      rescue
      end
    elsif
      begin
        File.copy(File.join(backup_path,entry), File.join(target_path, entry))
      rescue
      end
      File.unlink(File.join(backup_path,entry))
      puts " > Restoring " + entry
    end
  end
end
