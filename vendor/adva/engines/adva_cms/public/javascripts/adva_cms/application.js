var LoginLinks = {
	init: function() {
		var user_id = Cookie.get('uid');
		var user_name = unescape(Cookie.get('uname')).replace(/\+/g, " ");
		try { 
			LoginLinks.update_user_links(user_name) 
		} catch(err) {}
		if (user_id) {
			try { 
				$('#logout_links').show(); 
				$('#login_links').hide();
			} catch(err) {}
		}
	},

	update_user_links: function(user_name) {
		if($('#logout_link')) $('#logout_link').href = $('#logout_link').href + "?return_to=" + escape(document.location.href);
		if($('#login_link'))  $('#login_link').href  = $('#login_link').href  + "?return_to=" + escape(document.location.href);
		
		$('span.user_name').each(function() {
		  $(this).html(user_name);
		});
	}
};

URI.parseOptions.strictMode = true;

$(document).ready(function() {
	if($('#logout_links')) {
		LoginLinks.init();
	}
	
	convert_movie_in_articles();
});

function convert_movie_in_articles () {
  $.each(
    $(document.body).find('img.movie'),
    function(ix, item) {
      html = '<object style="background-image: url(\'' + item.src + '\')" width="300" height="300" data="/hulu/flowplayer-3.1.5.swf" type="application/x-shockwave-flash">' +
        '<param name="movie" value="/hulu/flowplayer-3.1.5.swf" /><param name="allowfullscreen" value="true" />' +
        '<param name="allowscriptaccess" value="always" />' +
        '<param name="flashvars" value=\'config={"plugins":{"controls":{"backgroundColor":"#000000","backgroundGradient":"low"}},"clip":{"url":"' + item.getAttribute("movie").replace(/\.tiny\./,".normal.") + '"},"playlist":[{"url":"' + item.getAttribute("movie").replace(/\.tiny\./,".normal.") + '"}]}\' />' +
        '</object>';

      var div = document.createElement("div");
      div.innerHTML = html;
      
      item.parentNode.insertBefore(div, item);
      item.parentNode.removeChild(item);
    }
  );
  
}