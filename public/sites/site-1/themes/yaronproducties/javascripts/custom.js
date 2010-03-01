/*Mainpage image changer with bounce animation*/

function bouncer(){

	if( $(".featured-item").length > 1 && $("#featured-content").hasClass('add_bounce')) 
	/*if more than one featured item is found in the html code the next button is generated, in addition to apply the bounce transition the featured-content div must have the class add_bounce*/
	{	
		var no_animation = true;
		var reflection = $("#reflect");
		var slide = $(".next-item")
		var transition = "bounceout";
		
		
		slide.css({visibility:'visible'}).bind("click",function()
		{	
			if(no_animation)
			{
				no_animation = false;
				reflection.css({display:"none"});
				
				
					$(".current-item").fadeOut(500, shownext);	
						
					
			}
			return false;									  
		});
		
		
		
		function shownext()
		{	
			var next_item = $(".current-item").next(".featured-item");
			if (next_item.length == 0) next_item = $(".featured-item:eq(0)");
			$('#featured-content').css({'z-index':150});
			
			reflection.css({bottom:-1024, display:"block"}).animate({bottom:-445},1800,transition);
			next_item.animate({top:103},1800,transition, function()
			{	
				$(".current-item").css({top:-500, display:"block"}).removeClass("current-item");
				$(this).addClass("current-item");
				$('#featured-content').css({'z-index':1});
				no_animation = true;
			});
		}
		
		
	}
}


/*Blogpage image changer with fadeing animation*/
function smooth_transition(){
	/*if more than one featured item is found in the html && div must have the class add_bounce to apply fading animation*/
	if( $(".featured-item").length > 1 && $("#featured-content").hasClass('add_fade'))
	{
		var reflection = $("#reflect");
		
		function transition()
		{
			if ($.browser.msie && $.browser.version < 7){
			reflection.css({display:"none"});	
				}else{
			reflection.fadeOut(500);
				}
				
			$(".current-item").fadeOut(500, shownext);	
		}
		
		
		function shownext()
		{	
			var next_item = $(".current-item").next(".featured-item");
			if (next_item.length == 0) next_item = $(".featured-item:eq(0)");
			
			
			
			if ($.browser.msie && $.browser.version < 7){
			reflection.css({display:"block"});	
				}else{
			reflection.fadeIn(500);
				}

			next_item.css({display:"none",top:93}).fadeIn(500, function()
			{	
				$(".current-item").css({display:"none"}).removeClass("current-item");
				$(this).addClass("current-item");
				no_animation = true;
			});
		}
		
		setInterval(transition,5000);
		
	}
}




/*Function that creates the tooltips*/
function kriesi_tooltip2(selector, selectname, atrribute){
$(selector).each(function(i){
			if ($(this).attr(atrribute) != ""){
			$("body").append("<div class='"+selectname+"' id='"+selectname+i+"'>"+$(this).attr(atrribute)+"</div>");
			
			$(this).removeAttr(atrribute).mouseover(function(e){
					$("#"+selectname+i).css({opacity:0.85, display:"none", visibility:"visible"}).animate({"padding": "6px"}, 100).fadeIn(400);
			}).mousemove(function(e){
					$("#"+selectname+i).css({left:e.pageX+14, top:e.pageY+14});
			}).mouseout(function(){
					$("#"+selectname+i).css({display:"none", visibility:"hidden"});				  
			});
			
			
			}
		});
 	}


/*This functions checks on which subpage you are and applies the background to the main menu*/
function whichpage() 
{
	var current_url = location.pathname;
	
	$(".lavaLamp a").each(function(i)
	{
		var item_url = $(this).attr('href');
		if(current_url.match(item_url))
		{
			$(this).parent('li').addClass('current');
		}
	});
}




/*the following 2 functions are validating the contact form*/

function form_validation(){
	$("#name, #email, #message").each(function(i){
									  
				$(this).bind("blur", function(){
				var value = JQ(this).attr("value");
				var check_for = JQ(this).attr("id");
				var surrounding_element = JQ(this);

				if(check_for == "email"){
					if(!value.match(/^\w[\w|\.|\-]+@\w[\w|\.|\-]+\.[a-zA-Z]{2,4}JQ/)){
						surrounding_element.attr("class","").addClass("invalid-form");
						}else{
						surrounding_element.attr("class","").addClass("ajax_valid");	
						}
					}
				
				if(check_for == "name" || check_for == "message"){
					if(value == ""){
						surrounding_element.attr("class","").addClass("invalid-form");
						}else{
						surrounding_element.attr("class","").addClass("ajax_valid");	
						}
					}
					
				
		 });
	});
}



function validate_all(){
	var my_error;
	$(".ajax_form #send").bind("click", function(){
											 
	my_error = false;
	$(".ajax_form #name, .ajax_form #message, .ajax_form #email ").each(function(i){
										   
				var value = $(this).attr("value");
				var check_for = $(this).attr("id");
				var surrounding_element = $(this);
				if(check_for == "email"){
					if(!value.match(/^\w[\w|\.|\-]+@\w[\w|\.|\-]+\.[a-zA-Z]{2,4}JQ/)){
						surrounding_element.attr("class","").addClass("invalid-form");
						my_error = true;
						}else{
						surrounding_element.attr("class","").addClass("ajax_valid");	
						}
					}
				
				if(check_for == "name" || check_for == "message"){
					if(value == ""){
						surrounding_element.attr("class","").addClass("invalid-form");
						my_error = true;
						}else{
						surrounding_element.attr("class","").addClass("ajax_valid");	
						}
					}
						   if($(".ajax_form #name, .ajax_form #message, .ajax_form #email").length  == i+1){
								if(my_error == false){
									$("#ajax_form").slideUp(400);
									var yourname = $("#name").attr('value');
									var email = $("#email").attr('value');
									var website = $("#website").attr('value');
									var message = $("#message").attr('value');
									var myemail = $("#myemail").attr('value');
									var myblogname = $("#myblogname").attr('value');
									$(".ajax_form #send").fadeOut(100);	
									
									$.ajax({
									   type: "POST",
									   url: "send.php",
									   data: "Send=true&yourname="+yourname+"&email="+email+"&website="+website+"&message="+message+"&myemail="+myemail+"&myblogname="+myblogname,
									   success: function(response){
									   $(".ajaxresponse").html(response); 
									   $(".ajax_form #send").fadeIn(400);
									   $(".ajax_form #name, .ajax_form #message, .ajax_form #email , .ajax_form #website").val("");
										   }
										});
									} 
							}
					});
			return false;
	});
}


 $(document).ready(function(){	
	$(".thumb a").fancybox();
	whichpage(); //checks wich suppage of the mainmenu we are and appends the current class for the lavalamp
	$(".lavaLamp").lavaLamp({ fx: "backout", speed: 700 });
	bouncer();
	smooth_transition();
	kriesi_tooltip2("a:not(.thumb a)", "tooltip_image2", "title");
	form_validation();
	validate_all();
	$("a.iframe").fancybox({ 'hideOnContentClick': false, 'zoomOpacity': true, 'overlayShow': false, 'zoomSpeedIn': 500, 'zoomSpeedOut': 500, 'frameWidth': 800, 'frameHeight': 600, });

	 
	
});



/*
 * jQuery Easing v1.1 - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Uses the built in easing capabilities added in jQuery 1.1
 * to offer multiple easing options
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
jQuery.easing={easein:function(x,t,b,c,d){return c*(t/=d)*t+b},easeinout:function(x,t,b,c,d){if(t<d/2)return 2*c*t*t/(d*d)+b;var a=t-d/2;return-2*c*a*a/(d*d)+2*c*a/d+c/2+b},easeout:function(x,t,b,c,d){return-c*t*t/(d*d)+2*c*t/d+b},expoin:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(Math.exp(Math.log(c)/d*t))+b},expoout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(-Math.exp(-Math.log(c)/d*(t-d))+c+1)+b},expoinout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}if(t<d/2)return a*(Math.exp(Math.log(c/2)/(d/2)*t))+b;return a*(-Math.exp(-2*Math.log(c/2)/d*(t-d))+c+1)+b},bouncein:function(x,t,b,c,d){return c-jQuery.easing['bounceout'](x,d-t,0,c,d)+b},bounceout:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},bounceinout:function(x,t,b,c,d){if(t<d/2)return jQuery.easing['bouncein'](x,t*2,0,c,d)*.5+b;return jQuery.easing['bounceout'](x,t*2-d,0,c,d)*.5+c*.5+b},elasin:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},elasout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},elasinout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},backin:function(x,t,b,c,d){var s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},backout:function(x,t,b,c,d){var s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},backinout:function(x,t,b,c,d){var s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},linear:function(x,t,b,c,d){return c*t/d+b}};


/**
 * LavaLamp - A menu plugin for jQuery with cool hover effects.
 * @requires jQuery v1.1.3.1 or above
 *
 * http://gmarwaha.com/blog/?p=7
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.2.0
 * Requires Jquery 1.2.1 from version 0.2.0 onwards. 
 * For jquery 1.1.x, use version 0.1.0 of lavalamp
 */

/**
 * Creates a menu with an unordered list of menu-items. You can either use the CSS that comes with the plugin, or write your own styles 
 * to create a personalized effect
 *
 * The HTML markup used to build the menu can be as simple as...
 *
 *       <ul class="lavaLamp">
 *           <li><a href="#">Home</a></li>
 *           <li><a href="#">Plant a tree</a></li>
 *           <li><a href="#">Travel</a></li>
 *           <li><a href="#">Ride an elephant</a></li>
 *       </ul>
 *
 * Once you have included the style sheet that comes with the plugin, you will have to include 
 * a reference to jquery library, easing plugin(optional) and the LavaLamp(this) plugin.
 *
 * Use the following snippet to initialize the menu.
 *   $(function() { $(".lavaLamp").lavaLamp({ fx: "backout", speed: 700}) });
 *
 * Thats it. Now you should have a working lavalamp menu. 
 *
 * @param an options object - You can specify all the options shown below as an options object param.
 *
 * @option fx - default is "linear"
 * @example
 * $(".lavaLamp").lavaLamp({ fx: "backout" });
 * @desc Creates a menu with "backout" easing effect. You need to include the easing plugin for this to work.
 *
 * @option speed - default is 500 ms
 * @example
 * $(".lavaLamp").lavaLamp({ speed: 500 });
 * @desc Creates a menu with an animation speed of 500 ms.
 *
 * @option click - no defaults
 * @example
 * $(".lavaLamp").lavaLamp({ click: function(event, menuItem) { return false; } });
 * @desc You can supply a callback to be executed when the menu item is clicked. 
 * The event object and the menu-item that was clicked will be passed in as arguments.
 */
(function($) {
$.fn.lavaLamp = function(o) {
    o = $.extend({ fx: "linear", speed: 500, click: function(){} }, o || {});

    return this.each(function() {
        var me = $(this), noop = function(){},
            $back = $('<li class="back"><div class="left"></div></li>').appendTo(me),
            $li = $("li", this), curr = $("li.current", this)[0] || $($li[0]).addClass("current")[0];

        $li.not(".back").hover(function() {
            move(this);
        }, noop);

        $(this).hover(noop, function() {
            move(curr);
        });

        $li.click(function(e) {
            setCurr(this);
            return o.click.apply(this, [e, this]);
        });

        setCurr(curr);

        function setCurr(el) {
            $back.css({ "left": el.offsetLeft+"px", "width": el.offsetWidth+"px" });
            curr = el;
        };

        function move(el) {
            $back.each(function() {
                $(this).dequeue(); }
            ).animate({
                width: el.offsetWidth,
                left: el.offsetLeft
            }, o.speed, o.fx);
        };

    });
};
})(jQuery);
