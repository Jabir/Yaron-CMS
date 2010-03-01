/*
 * FancyBox - simple jQuery plugin for fancy image zooming
 * Examples and documentation at: http://fancy.klade.lv/
 * Version: 1.0.0 (29/04/2008)
 * Copyright (c) 2008 Janis Skarnelis
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery v1.2.1 or later
*/
(function(JQ) {
	var opts = {}, 
		imgPreloader = new Image, imgTypes = ['png', 'jpg', 'jpeg', 'gif'], 
		loadingTimer, loadingFrame = 1;

   JQ.fn.fancybox = function(settings) {
		opts.settings = JQ.extend({}, JQ.fn.fancybox.defaults, settings);

		JQ.fn.fancybox.init();

		return this.each(function() {
			var JQthis = JQ(this);
			var o = JQ.metadata ? JQ.extend({}, opts.settings, JQthis.metadata()) : opts.settings;

			JQthis.unbind('click').click(function() {
				JQ.fn.fancybox.start(this, o); return false;
			});
		});
	};

	JQ.fn.fancybox.start = function(el, o) {
		if (opts.animating) return false;

		if (o.overlayShow) {
			JQ("#fancy_wrap").prepend('<div id="fancy_overlay"></div>');
			JQ("#fancy_overlay").css({'width': JQ(window).width(), 'height': JQ(document).height(), 'opacity': o.overlayOpacity});

			if (JQ.browser.msie) {
				JQ("#fancy_wrap").prepend('<iframe id="fancy_bigIframe" scrolling="no" frameborder="0"></iframe>');
				JQ("#fancy_bigIframe").css({'width': JQ(window).width(), 'height': JQ(document).height(), 'opacity': 0});
			}

			JQ("#fancy_overlay").click(JQ.fn.fancybox.close);
		}

		opts.itemArray	= [];
		opts.itemNum	= 0;

		if (jQuery.isFunction(o.itemLoadCallback)) {
		   o.itemLoadCallback.apply(this, [opts]);

			var c	= JQ(el).children("img:first").length ? JQ(el).children("img:first") : JQ(el);
			var tmp	= {'width': c.width(), 'height': c.height(), 'pos': JQ.fn.fancybox.getPosition(c)}

		   for (var i = 0; i < opts.itemArray.length; i++) {
				opts.itemArray[i].o = JQ.extend({}, o, opts.itemArray[i].o);
				
				if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
					opts.itemArray[i].orig = tmp;
				}
		   }

		} else {
			if (!el.rel || el.rel == '') {
				var item = {url: el.href, title: el.title, o: o};

				if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
					var c = JQ(el).children("img:first").length ? JQ(el).children("img:first") : JQ(el);
					item.orig = {'width': c.width(), 'height': c.height(), 'pos': JQ.fn.fancybox.getPosition(c)}
				}

				opts.itemArray.push(item);

			} else {
				var arr	= JQ("a[@rel=" + el.rel + "]").get();

				for (var i = 0; i < arr.length; i++) {
					var tmp		= JQ.metadata ? JQ.extend({}, o, JQ(arr[i]).metadata()) : o;
   					var item	= {url: arr[i].href, title: arr[i].title, o: tmp};

   					if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0) {
						var c = JQ(arr[i]).children("img:first").length ? JQ(arr[i]).children("img:first") : JQ(el);

						item.orig = {'width': c.width(), 'height': c.height(), 'pos': JQ.fn.fancybox.getPosition(c)}
					}

					if (arr[i].href == el.href) opts.itemNum = i;

					opts.itemArray.push(item);
				}
			}
		}

		JQ.fn.fancybox.changeItem(opts.itemNum);
	};

	JQ.fn.fancybox.changeItem = function(n) {
		JQ.fn.fancybox.showLoading();

		opts.itemNum = n;

		JQ("#fancy_nav").empty();
		JQ("#fancy_outer").stop();
		JQ("#fancy_title").hide();
		JQ(document).unbind("keydown");

		imgRegExp = imgTypes.join('|');
    	imgRegExp = new RegExp('\.' + imgRegExp + 'JQ', 'i');

		var url = opts.itemArray[n].url;

		if (url.match(/#/)) {
			var target = window.location.href.split('#')[0]; target = url.replace(target,'');

	        JQ.fn.fancybox.showItem('<div id="fancy_div">' + JQ(target).html() + '</div>');

	        JQ("#fancy_loading").hide();

		} else if (url.match(imgRegExp)) {
			JQ(imgPreloader).unbind('load').bind('load', function() {
				JQ("#fancy_loading").hide();

				opts.itemArray[n].o.frameWidth	= imgPreloader.width;
				opts.itemArray[n].o.frameHeight	= imgPreloader.height;

				JQ.fn.fancybox.showItem('<img id="fancy_img" src="' + imgPreloader.src + '" />');

			}).attr('src', url + '?rand=' + Math.floor(Math.random() * 999999999) );


		} else {
			JQ.fn.fancybox.showItem('<iframe id="fancy_frame" onload="JQ.fn.fancybox.showIframe()" name="fancy_iframe' + Math.round(Math.random()*1000) + '" frameborder="0" hspace="0" src="' + url + '"></iframe>');
		}
	};

	JQ.fn.fancybox.showIframe = function() {
		JQ("#fancy_loading").hide();
		JQ("#fancy_frame").show();
	};

	JQ.fn.fancybox.showItem = function(val) {
		JQ.fn.fancybox.preloadNeighborImages();

		var viewportPos	= JQ.fn.fancybox.getViewport();
		var itemSize	= JQ.fn.fancybox.getMaxSize(viewportPos[0] - 50, viewportPos[1] - 100, opts.itemArray[opts.itemNum].o.frameWidth, opts.itemArray[opts.itemNum].o.frameHeight);

		var itemLeft	= viewportPos[2] + Math.round((viewportPos[0] - itemSize[0]) / 2) - 20;
		var itemTop		= viewportPos[3] + Math.round((viewportPos[1] - itemSize[1]) / 2) - 40;

		var itemOpts = {
			'left':		itemLeft, 
			'top':		itemTop, 
			'width':	itemSize[0] + 'px', 
			'height':	itemSize[1] + 'px'	
		}

		if (opts.active) {
			JQ('#fancy_content').fadeOut("normal", function() {
				JQ("#fancy_content").empty();
				
				JQ("#fancy_outer").animate(itemOpts, "normal", function() {
					JQ("#fancy_content").append(JQ(val)).fadeIn("normal");
					JQ.fn.fancybox.updateDetails();
				});
			});

		} else {
			opts.active = true;

			JQ("#fancy_content").empty();

			if (JQ("#fancy_content").is(":animated")) {
				console.info('animated!');
			}

			if (opts.itemArray[opts.itemNum].o.zoomSpeedIn > 0) {
				opts.animating		= true;
				itemOpts.opacity	= "show";

				JQ("#fancy_outer").css({
					'top':		opts.itemArray[opts.itemNum].orig.pos.top - 18,
					'left':		opts.itemArray[opts.itemNum].orig.pos.left - 18,
					'height':	opts.itemArray[opts.itemNum].orig.height,
					'width':	opts.itemArray[opts.itemNum].orig.width
				});

				JQ("#fancy_content").append(JQ(val)).show();

				JQ("#fancy_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedIn, function() {
					opts.animating = false;
					JQ.fn.fancybox.updateDetails();
				});

			} else {
				JQ("#fancy_content").append(JQ(val)).show();
				JQ("#fancy_outer").css(itemOpts).show();
				JQ.fn.fancybox.updateDetails();
			}
		 }
	};

	JQ.fn.fancybox.updateDetails = function() {
		JQ("#fancy_bg,#fancy_close").show();

		if (opts.itemArray[opts.itemNum].title !== undefined && opts.itemArray[opts.itemNum].title !== '') {
			JQ('#fancy_title div').html(opts.itemArray[opts.itemNum].title);
			JQ('#fancy_title').show();
		}

		if (opts.itemArray[opts.itemNum].o.hideOnContentClick) {
			JQ("#fancy_content").click(JQ.fn.fancybox.close);
		} else {
			JQ("#fancy_content").unbind('click');
		}

		if (opts.itemNum != 0) {
			JQ("#fancy_nav").append('<a id="fancy_left" href="javascript:;"></a>');

			JQ('#fancy_left').click(function() {
				JQ.fn.fancybox.changeItem(opts.itemNum - 1); return false;
			});
		}

		if (opts.itemNum != (opts.itemArray.length - 1)) {
			JQ("#fancy_nav").append('<a id="fancy_right" href="javascript:;"></a>');
			
			JQ('#fancy_right').click(function(){
				JQ.fn.fancybox.changeItem(opts.itemNum + 1); return false;
			});
		}

		JQ(document).keydown(function(event) {
			if (event.keyCode == 27) {
            	JQ.fn.fancybox.close();

			} else if(event.keyCode == 37 && opts.itemNum != 0) {
            	JQ.fn.fancybox.changeItem(opts.itemNum - 1);

			} else if(event.keyCode == 39 && opts.itemNum != (opts.itemArray.length - 1)) {
            	JQ.fn.fancybox.changeItem(opts.itemNum + 1);
			}
		});
	};

	JQ.fn.fancybox.preloadNeighborImages = function() {
		if ((opts.itemArray.length - 1) > opts.itemNum) {
			preloadNextImage = new Image();
			preloadNextImage.src = opts.itemArray[opts.itemNum + 1].url;
		}

		if (opts.itemNum > 0) {
			preloadPrevImage = new Image();
			preloadPrevImage.src = opts.itemArray[opts.itemNum - 1].url;
		}
	};

	JQ.fn.fancybox.close = function() {
		if (opts.animating) return false;

		JQ(imgPreloader).unbind('load');
		JQ(document).unbind("keydown");

		JQ("#fancy_loading,#fancy_title,#fancy_close,#fancy_bg").hide();

		JQ("#fancy_nav").empty();

		opts.active	= false;

		if (opts.itemArray[opts.itemNum].o.zoomSpeedOut > 0) {
			var itemOpts = {
				'top':		opts.itemArray[opts.itemNum].orig.pos.top - 18,
				'left':		opts.itemArray[opts.itemNum].orig.pos.left - 18,
				'height':	opts.itemArray[opts.itemNum].orig.height,
				'width':	opts.itemArray[opts.itemNum].orig.width,
				'opacity':	'hide'
			};

			opts.animating = true;

			JQ("#fancy_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedOut, function() {
				JQ("#fancy_content").hide().empty();
				JQ("#fancy_overlay,#fancy_bigIframe").remove();
				opts.animating = false;
			});

		} else {
			JQ("#fancy_outer").hide();
			JQ("#fancy_content").hide().empty();
			JQ("#fancy_overlay,#fancy_bigIframe").fadeOut("fast").remove();
		}
	};

	JQ.fn.fancybox.showLoading = function() {
		clearInterval(loadingTimer);

		var pos = JQ.fn.fancybox.getViewport();

		JQ("#fancy_loading").css({'left': ((pos[0] - 40) / 2 + pos[2]), 'top': ((pos[1] - 40) / 2 + pos[3])}).show();
		JQ("#fancy_loading").bind('click', JQ.fn.fancybox.close);
		
		loadingTimer = setInterval(JQ.fn.fancybox.animateLoading, 66);
	};

	JQ.fn.fancybox.animateLoading = function(el, o) {
		if (!JQ("#fancy_loading").is(':visible')){
			clearInterval(loadingTimer);
			return;
		}

		JQ("#fancy_loading > div").css('top', (loadingFrame * -40) + 'px');

		loadingFrame = (loadingFrame + 1) % 12;
	};

	JQ.fn.fancybox.init = function() {
		if (!JQ('#fancy_wrap').length) {
			JQ('<div id="fancy_wrap"><div id="fancy_loading"><div></div></div><div id="fancy_outer"><div id="fancy_inner"><div id="fancy_nav"></div><div id="fancy_close"></div><div id="fancy_content"></div><div id="fancy_title"></div></div></div></div>').appendTo("body");
			JQ('<div id="fancy_bg"><div class="fancy_bg fancy_bg_n"></div><div class="fancy_bg fancy_bg_ne"></div><div class="fancy_bg fancy_bg_e"></div><div class="fancy_bg fancy_bg_se"></div><div class="fancy_bg fancy_bg_s"></div><div class="fancy_bg fancy_bg_sw"></div><div class="fancy_bg fancy_bg_w"></div><div class="fancy_bg fancy_bg_nw"></div></div>').prependTo("#fancy_inner");
			
			JQ('<table cellspacing="0" cellpadding="0" border="0"><tr><td id="fancy_title_left"></td><td id="fancy_title_main"><div></div></td><td id="fancy_title_right"></td></tr></table>').appendTo('#fancy_title');
		}

		if (JQ.browser.msie) {
			JQ("#fancy_inner").prepend('<iframe id="fancy_freeIframe" scrolling="no" frameborder="0"></iframe>');
		}

		if (jQuery.fn.pngFix) JQ(document).pngFix();

    	JQ("#fancy_close").click(JQ.fn.fancybox.close);
	};

	JQ.fn.fancybox.getPosition = function(el) {
		var pos = el.offset();

		pos.top	+= JQ.fn.fancybox.num(el, 'paddingTop');
		pos.top	+= JQ.fn.fancybox.num(el, 'borderTopWidth');

 		pos.left += JQ.fn.fancybox.num(el, 'paddingLeft');
		pos.left += JQ.fn.fancybox.num(el, 'borderLeftWidth');

		return pos;
	};

	JQ.fn.fancybox.num = function (el, prop) {
		return parseInt(JQ.curCSS(el.jquery?el[0]:el,prop,true))||0;
	};

	JQ.fn.fancybox.getPageScroll = function() {
		var xScroll, yScroll;

		if (self.pageYOffset) {
			yScroll = self.pageYOffset;
			xScroll = self.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			yScroll = document.documentElement.scrollTop;
			xScroll = document.documentElement.scrollLeft;
		} else if (document.body) {
			yScroll = document.body.scrollTop;
			xScroll = document.body.scrollLeft;	
		}

		return [xScroll, yScroll]; 
	};

	JQ.fn.fancybox.getViewport = function() {
		var scroll = JQ.fn.fancybox.getPageScroll();

		return [JQ(window).width(), JQ(window).height(), scroll[0], scroll[1]];
	};

	JQ.fn.fancybox.getMaxSize = function(maxWidth, maxHeight, imageWidth, imageHeight) {
		var r = Math.min(Math.min(maxWidth, imageWidth) / imageWidth, Math.min(maxHeight, imageHeight) / imageHeight);

		return [Math.round(r * imageWidth), Math.round(r * imageHeight)];
	};

	JQ.fn.fancybox.defaults = {
		hideOnContentClick:	false,
		zoomSpeedIn:		500,
		zoomSpeedOut:		500,
		frameWidth:			600,
		frameHeight:		400,
		overlayShow:		false,
		overlayOpacity:		0.4,
		itemLoadCallback:	null
	};
})(jQuery);