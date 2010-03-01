<!-- ui-dialog -->
$(function(){
// Dialog			
$('#dialog').dialog({
		autoOpen: false,
		width: 200,
		buttons: {
		"Sluiten": function() { 
		$(this).dialog("close");
		} 
	}
});				
// Dialog Link
$('#dialog_link').click(function(){
		$('#dialog').dialog('open');
		return false;
		});
//hover states on the static widgets
       $('#dialog_link, ul#icons li').hover(
              function() { $(this).addClass('ui-state-hover'); }, 
	function() { $(this).removeClass('ui-state-hover'); }
			);				
});
$(function(){
// Dialog			
$('#dialog2').dialog({
		autoOpen: false,
		width: 200,
		buttons: {
		"Sluiten": function() { 
		$(this).dialog("close"); 
		} 
	}
});				
// Dialog Link
$('#dialog2_link').click(function(){
		$('#dialog2').dialog('open');
		return false;
		});
//hover states on the static widgets
       $('#dialog2_link, ul#icons li').hover(
              function() { $(this).addClass('ui-state-hover'); }, 
	function() { $(this).removeClass('ui-state-hover'); }
			);				
});
$(document).ajaxPost(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;
  // settings.data is a serialized string like "foo=bar&baz=boink" (or null)
  settings.data = settings.data || "";
  settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
});

