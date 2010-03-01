JQ(function(){

				// Accordion
				JQ("#accordion").accordion({ header: "h3" });
	
				// Tabs
				JQ('#tabs').tabs();
	

				// Dialog			
				JQ('#dialog').dialog({
					autoOpen: false,
					width: 600,
					buttons: {
						"Ok": function() { 
							JQ(this).dialog("close"); 
						}, 
						"Cancel": function() { 
							JQ(this).dialog("close"); 
						} 
					}
				});
				
				// Dialog Link
				JQ('#dialog_link').click(function(){
					JQ('#dialog').dialog('open');
					return false;
				});

				// Datepicker
				JQ('#datepicker').datepicker({
					inline: true
				});
				
				// Slider
				JQ('#slider').slider({
					range: true,
					values: [17, 67]
				});
				
				// Progressbar
				JQ("#progressbar").progressbar({
					value: 20 
				});
				
				//hover states on the static widgets
				JQ('#dialog_link, ul#icons li').hover(
					function() { JQ(this).addClass('ui-state-hover'); }, 
					function() { JQ(this).removeClass('ui-state-hover'); }
				);
				
			});


