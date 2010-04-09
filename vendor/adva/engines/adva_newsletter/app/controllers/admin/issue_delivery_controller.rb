class Admin::IssueDeliveryController < Admin::BaseController
  guards_permissions :issue 

  before_filter :set_newsletter
  before_filter :set_issue

  def create
    if params[:send_all].present?
      @issue.deliver ? flash[:notice] = "OK " + t(:"adva.newsletter.flash.send_all") : "FAIL " + failure_message
    elsif params[:send_all_later].present?
      @issue.deliver(:later_at => params[:deliver_at]) ? flash[:notice] = "OK " + t(:"adva.newsletter.flash.send_all_later") : "FAIL " + failure_message
    else
      @issue.deliver(:to => current_user) ? flash[:notice] = "OK " + t(:"adva.newsletter.flash.send_preview_issue") : "FAIL " + failure_message
    end
    render :text => flash[:notice].to_s
    # redirect_to admin_adva_issue_url(@site, @newsletter, @issue)
  end
  
  def destroy
    if @issue.cancel_delivery
      render :text => "OK " + t(:"adva.newsletter.flash.delivery_cancellation_success")
    else
      render :text => "FAIL " + t(:"adva.newsletter.flash.delivery_cancellation_failed")
    end
    # redirect_to admin_adva_issue_url(@site, @newsletter, @issue)
  end
  

private
  def set_newsletter
    @newsletter = Adva::Newsletter.find(params[:newsletter_id])
  end
  
  def set_issue
    @issue = Adva::Issue.find(params[:issue_id])
  end
  
  def failure_message
    flash[:error] = t(:"adva.newsletter.flash.delivery_start_failed")
  end
end
