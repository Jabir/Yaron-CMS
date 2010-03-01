module SearchHelper
  def event_dates_from_to(event)
    if event.all_day?
      if event.end_date.blank? or event.start_date.to_date == event.end_date.to_date
        return [event.start_date.beginning_of_day]
      else
        return [event.start_date.beginning_of_day, event.end_date.end_of_day]
      end
    else
      return [event.start_date, event.end_date].compact
    end
  end
end
