# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def tag_list_for_site(site)
    tags = Tag.find_by_sql("
      SELECT DISTINCT tags.*
      FROM tags
      INNER JOIN taggings ON taggings.tag_id = tags.id
      AND taggings.taggable_type = 'CalendarEvent'
      INNER JOIN calendar_events ON calendar_events.id = taggings.taggable_id
      AND calendar_events.published_at IS NOT NULL
      INNER JOIN sections ON sections.id = calendar_events.section_id
      AND sections.site_id = " + site.id.to_s + "

      UNION ALL

      SELECT DISTINCT tags.*
      FROM tags
      INNER JOIN taggings ON taggings.tag_id = tags.id
      AND taggings.taggable_type = 'Content'
      INNER JOIN contents ON contents.id = taggings.taggable_id
      AND contents.published_at IS NOT NULL
      AND contents.site_id = " + site.id.to_s + "

      UNION ALL

      SELECT DISTINCT tags.*
      FROM tags
      INNER JOIN taggings ON taggings.tag_id = tags.id
      AND taggings.taggable_type = 'Asset'
      INNER JOIN assets ON assets.id = taggings.taggable_id
      AND assets.site_id = " + site.id.to_s + "
    ").collect{|t| '<a style="10" href="/search/' + site.id.to_s + '/tags/' + h(t.name) + '" color="0x261B12" hicolor="0x402E24">' + h(t.name) + '</a>' }
    
    content_tag 'tags', tags
  end
end
