require File.expand_path(File.dirname(__FILE__) + "/../../test_helper")

class RolesHelperTest < ActionView::TestCase
  include RolesHelper
  
  def setup
    super
    @article = Article.first
    
    @superuser_role = Rbac::Role.build :superuser
    @admin_role     = Rbac::Role.build :admin, :context => Site.first
    @moderator_role = Rbac::Role.build :moderator, :context => Section.first
    @author_role    = Rbac::Role.build :author, :context => @article
    @user_role      = Rbac::Role.build :user
    @anonymous_role = Rbac::Role.build :anonymous
  end

  # role_to_default_css_class
  test "#role_to_default_css_class returns the role's name if no context is given" do
    role_to_default_css_class(@user_role).should == 'user'
  end

  test "#role_to_default_css_class returns the role's context and name if context is given" do
    role_to_default_css_class(@moderator_role).should =~ /section-[\d]+-moderator/
  end
  
  # role_to_css_class
  test "#role_to_css_class returns 'anonymous' for an anonymous role" do
    role_to_css_class(@anonymous_role).should == 'anonymous'
  end
  
  test "#role_to_css_class returns 'user' for a user role" do
    role_to_css_class(@user_role).should == 'user'
  end
  
  test "#role_to_css_class returns 'user-1 content-1-author' for an author role when the author is a user" do
    role_to_css_class(@author_role).should =~ /user-[\d]+ content-[\d]+-author/
  end
  
  test "#role_to_css_class returns 'anonymous-1 content-1-author' for an author role when the author is an anonymous" do
    @article.author_type = 'Anonymous'
    role_to_css_class(@author_role).should =~ /anonymous-[\d]+ content-[\d]+-author/
  end
  
  test "#role_to_css_class returns 'section-1-moderator' for a user role" do
    role_to_css_class(@moderator_role).should =~ /section-[\d]+-moderator/
  end
  
  test "#role_to_css_class returns 'site-1-admin' for a admin role" do
    role_to_css_class(@admin_role).should =~ /site-[\d]+-admin/
  end
  
  test "#role_to_css_class returns 'superuser' for a superuser role" do
    role_to_css_class(@superuser_role).should == 'superuser'
  end
  
  # authorized_link_to
  test "#authorize_elements adds authorizing css classes to the :class option" do
    object = Object.new
    mock(self).add_authorizing_css_classes!({}, :update, object)
    authorized_link_to('text', 'url', :update, object)
  end
  
  # authorizing_css_classes
  test "#authorizing_css_classes turns the given roles to css classes that allow a user to see an element" do
    authorizing_css_classes([@superuser_role]).should == 'superuser'
  end
  
  test "#authorizing_css_classesgiven the option :quote it encloses the classes in single quotes" do
    authorizing_css_classes([@superuser_role], {:quote => true}).should == "'superuser'"
  end
  
  test "#authorizing_css_classesgiven the option :separator it joins the classes using it" do
    authorizing_css_classes([@superuser_role, @superuser_role], {:separator => ','}).should == "superuser,superuser"
  end
end