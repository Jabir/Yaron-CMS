/*
 * FancyBox - simple and fancy jQuery plugin
 * Examples and documentation at: http://fancy.klade.lv/
 * Version: 1.2.1 (13/03/2009)
 * Copyright (c) 2009 Janis Skarnelis
 * Licensed under the MIT License: http://en.wikipedia.org/wiki/MIT_License
 * Requires: jQuery v1.3+
*/
;(function(JQ) {

	JQ.fn.fixPNG = function() {
		return this.each(function () {
			var image = JQ(this).css('backgroundImage');

			if (image.match(/^url\(["']?(.*\.png)["']?\)JQ/i)) {
				image = RegExp.JQ1;
				JQ(this).css({
					'backgroundImage': 'none',
					'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=" + (JQ(this).css('backgroundRepeat') == 'no-repeat' ? 'crop' : 'scale') + ", src='" + image + "')"
				}).each(function () {
					var position = JQ(this).css('position');
					if (position != 'absolute' && position != 'relative')
						JQ(this).css('position', 'relative');
				});
			}
		});
	};

	var elem, opts, busy = false, imagePreloader = new Image, loadingTimer, loadingFrame = 1, imageRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?JQ/i;
	var isIE = (JQ.browser.msie && parseInt(JQ.browser.version.substr(0,1)) < 8);

	JQ.fn.fancybox = function(settings) {
		settings = JQ.extend({}, JQ.fn.fancybox.defaults, settings);

		var matchedGroup = this;

		function _initialize() {
			elem = this;
			opts = settings;

			_start();

			return false;
		};

		function _start() {
			if (busy) return;

			if (JQ.isFunction(opts.callbackOnStart)) {
				opts.callbackOnStart();
			}

			opts.itemArray		= [];
			opts.itemCurrent	= 0;

			if (settings.itemArray.length > 0) {
				opts.itemArray = settings.itemArray;

			} else {
				var item = {};

				if (!elem.rel || elem.rel == '') {
					var item = {href: elem.href, title: elem.title};

					if (JQ(elem).children("img:first").length) {
						item.orig = JQ(elem).children("img:first");
					}

					opts.itemArray.push( item );

				} else {
					
					var subGroup = JQ(matchedGroup).filter("a[rel=" + elem.rel + "]");

					var item = {};

					for (var i = 0; i < subGroup.length; i++) {
						item = {href: subGroup[i].href, title: subGroup[i].title};

						if (JQ(subGroup[i]).children("img:first").length) {
							item.orig = JQ(subGroup[i]).children("img:first");
						}

						opts.itemArray.push( item );
					}

					while ( opts.itemArray[ opts.itemCurrent ].href != elem.href ) {
						opts.itemCurrent++;
					}
				}
			}

			if (opts.overlayShow) {
				if (isIE) {
					JQ('embed, object, select').css('visibility', 'hidden');
				}

				JQ("#fancy_overlay").css('opacity', opts.overlayOpacity).show();
			}

			_change_item();
		};

		function _change_item() {
			JQ("#fancy_right, #fancy_left, #fancy_close, #fancy_title").hide();

			var href = opts.itemArray[ opts.itemCurrent ].href;

			if (href.match(/#/)) {
				var target = window.location.href.split('#')[0]; target = href.replace(target, ''); target = target.substr(target.indexOf('#'));

				_set_content('<div id="fancy_div">' + JQ(target).html() + '</div>', opts.frameWidth, opts.frameHeight);

			} else if (href.match(imageRegExp)) {
				imagePreloader = new Image; imagePreloader.src = href;

				if (imagePreloader.complete) {
					_proceed_image();

				} else {
					JQ.fn.fancybox.showLoading();

					JQ(imagePreloader).unbind().bind('load', function() {
						JQ(".fancy_loading").hide();

						_proceed_image();
					});
				}

			 } else if (href.match("iframe") || elem.className.indexOf("iframe") >= 0) {
				_set_content('<iframe id="fancy_frame" onload="JQ.fn.fancybox.showIframe()" name="fancy_iframe' + Math.round(Math.random()*1000) + '" frameborder="0" hspace="0" src="' + href + '"></iframe>', opts.frameWidth, opts.frameHeight);

			} else {
				JQ.get(href, function(data) {
					_set_content( '<div id="fancy_ajax">' + data + '</div>', opts.frameWidth, opts.frameHeight );
				});
			}
		};

		function _proceed_image() {
			if (opts.imageScale) {
				var w = JQ.fn.fancybox.getViewport();

				var r = Math.min(Math.min(w[0] - 36, imagePreloader.width) / imagePreloader.width, Math.min(w[1] - 60, imagePreloader.height) / imagePreloader.height);

				var width = Math.round(r * imagePreloader.width);
				var height = Math.round(r * imagePreloader.height);

			} else {
				var width = imagePreloader.width;
				var height = imagePreloader.height;
			}

			_set_content('<img alt="" id="fancy_img" src="' + imagePreloader.src + '" />', width, height);
		};

		function _preload_neighbor_images() {
			if ((opts.itemArray.length -1) > opts.itemCurrent) {
				var href = opts.itemArray[opts.itemCurrent + 1].href;

				if (href.match(imageRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}

			if (opts.itemCurrent > 0) {
				var href = opts.itemArray[opts.itemCurrent -1].href;

				if (href.match(imageRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}
		};

		function _set_content(value, width, height) {
			busy = true;

			var pad = opts.padding;

			if (isIE) {
				JQ("#fancy_content")[0].style.removeExpression("height");
				JQ("#fancy_content")[0].style.removeExpression("width");
			}

			if (pad > 0) {
				width	+= pad * 2;
				height	+= pad * 2;

				JQ("#fancy_content").css({
					'top'		: pad + 'px',
					'right'		: pad + 'px',
					'bottom'	: pad + 'px',
					'left'		: pad + 'px',
					'width'		: 'auto',
					'height'	: 'auto'
				});

				if (isIE) {
					JQ("#fancy_content")[0].style.setExpression('height',	'(this.parentNode.clientHeight - 20)');
					JQ("#fancy_content")[0].style.setExpression('width',		'(this.parentNode.clientWidth - 20)');
				}

			} else {
				JQ("#fancy_content").css({
					'top'		: 0,
					'right'		: 0,
					'bottom'	: 0,
					'left'		: 0,
					'width'		: '100%',
					'height'	: '100%'
				});
			}

			if (JQ("#fancy_outer").is(":visible") && width == JQ("#fancy_outer").width() && height == JQ("#fancy_outer").height()) {
				JQ("#fancy_content").fadeOut("fast", function() {
					JQ("#fancy_content").empty().append(JQ(value)).fadeIn("normal", function() {
						_finish();
					});
				});

				return;
			}

			var w = JQ.fn.fancybox.getViewport();

			var itemLeft	= (width + 36)	> w[0] ? w[2] : (w[2] + Math.round((w[0] - width - 36) / 2));
			var itemTop		= (height + 50)	> w[1] ? w[3] : (w[3] + Math.round((w[1] - height - 50) / 2));

			var itemOpts = {
				'left':		itemLeft,
				'top':		itemTop,
				'width':	width + 'px',
				'height':	height + 'px'
			};

			if (JQ("#fancy_outer").is(":visible")) {
				JQ("#fancy_content").fadeOut("normal", function() {
					JQ("#fancy_content").empty();
					JQ("#fancy_outer").animate(itemOpts, opts.zoomSpeedChange, opts.easingChange, function() {
						JQ("#fancy_content").append(JQ(value)).fadeIn("normal", function() {
							_finish();
						});
					});
				});

			} else {

				if (opts.zoomSpeedIn > 0 && opts.itemArray[opts.itemCurrent].orig !== undefined) {
					JQ("#fancy_content").empty().append(JQ(value));

					var orig_item	= opts.itemArray[opts.itemCurrent].orig;
					var orig_pos	= JQ.fn.fancybox.getPosition(orig_item);

					JQ("#fancy_outer").css({
						'left':		(orig_pos.left - 18) + 'px',
						'top':		(orig_pos.top  - 18) + 'px',
						'width':	JQ(orig_item).width(),
						'height':	JQ(orig_item).height()
					});

					if (opts.zoomOpacity) {
						itemOpts.opacity = 'show';
					}

					JQ("#fancy_outer").animate(itemOpts, opts.zoomSpeedIn, opts.easingIn, function() {
						_finish();
					});

				} else {

					JQ("#fancy_content").hide().empty().append(JQ(value)).show();
					JQ("#fancy_outer").css(itemOpts).fadeIn("normal", function() {
						_finish();
					});
				}
			}
		};

		function _set_navigation() {
			if (opts.itemCurrent != 0) {
				JQ("#fancy_left, #fancy_left_ico").unbind().bind("click", function(e) {
					e.stopPropagation();

					opts.itemCurrent--;
					_change_item();

					return false;
				});

				JQ("#fancy_left").show();
			}

			if (opts.itemCurrent != ( opts.itemArray.length -1)) {
				JQ("#fancy_right, #fancy_right_ico").unbind().bind("click", function(e) {
					e.stopPropagation();

					opts.itemCurrent++;
					_change_item();

					return false;
				});

				JQ("#fancy_right").show();
			}
		};

		function _finish() {
			_set_navigation();

			_preload_neighbor_images();

			JQ(document).keydown(function(e) {
				if (e.keyCode == 27) {
					JQ.fn.fancybox.close();
					JQ(document).unbind("keydown");

				} else if(e.keyCode == 37 && opts.itemCurrent != 0) {
					opts.itemCurrent--;
					_change_item();
					JQ(document).unbind("keydown");

				} else if(e.keyCode == 39 && opts.itemCurrent != (opts.itemArray.length - 1)) {
 					opts.itemCurrent++;
					_change_item();
					JQ(document).unbind("keydown");
				}
			});

			if (opts.centerOnScroll) {
				JQ(window).bind("resize scroll", JQ.fn.fancybox.scrollBox);
			} else {
				JQ("div#fancy_outer").css("position", "absolute");
			}

			if (opts.hideOnContentClick) {
				JQ("#fancy_wrap").click(JQ.fn.fancybox.close);
			}

			JQ("#fancy_overlay, #fancy_close").bind("click", JQ.fn.fancybox.close);

			JQ("#fancy_close").show();

			if (opts.itemArray[ opts.itemCurrent ].title !== undefined && opts.itemArray[ opts.itemCurrent ].title.length > 0) {
				JQ('#fancy_title div').html(opts.itemArray[ opts.itemCurrent ].title);
				JQ('#fancy_title').show();
			}

			if (opts.overlayShow && isIE) {
				JQ('embed, object, select', JQ('#fancy_content')).css('visibility', 'visible');
			}

			if (JQ.isFunction(opts.callbackOnShow)) {
				opts.callbackOnShow();
			}

			busy = false;
		};

		return this.unbind('click').click(_initialize);
	};

	JQ.fn.fancybox.scrollBox = function() {
		var pos = JQ.fn.fancybox.getViewport();

		JQ("#fancy_outer").css('left', ((JQ("#fancy_outer").width()	+ 36) > pos[0] ? pos[2] : pos[2] + Math.round((pos[0] - JQ("#fancy_outer").width()	- 36)	/ 2)));
		JQ("#fancy_outer").css('top',  ((JQ("#fancy_outer").height()	+ 50) > pos[1] ? pos[3] : pos[3] + Math.round((pos[1] - JQ("#fancy_outer").height()	- 50)	/ 2)));
	};

	JQ.fn.fancybox.getNumeric = function(el, prop) {
		return parseInt(JQ.curCSS(el.jquery?el[0]:el,prop,true))||0;
	};

	JQ.fn.fancybox.getPosition = function(el) {
		var pos = el.offset();

		pos.top	+= JQ.fn.fancybox.getNumeric(el, 'paddingTop');
		pos.top	+= JQ.fn.fancybox.getNumeric(el, 'borderTopWidth');

		pos.left += JQ.fn.fancybox.getNumeric(el, 'paddingLeft');
		pos.left += JQ.fn.fancybox.getNumeric(el, 'borderLeftWidth');

		return pos;
	};

	JQ.fn.fancybox.showIframe = function() {
		JQ(".fancy_loading").hide();
		JQ("#fancy_frame").show();
	};

	JQ.fn.fancybox.getViewport = function() {
		return [JQ(window).width(), JQ(window).height(), JQ(document).scrollLeft(), JQ(document).scrollTop() ];
	};

	JQ.fn.fancybox.animateLoading = function() {
		if (!JQ("#fancy_loading").is(':visible')){
			clearInterval(loadingTimer);
			return;
		}

		JQ("#fancy_loading > div").css('top', (loadingFrame * -40) + 'px');

		loadingFrame = (loadingFrame + 1) % 12;
	};

	JQ.fn.fancybox.showLoading = function() {
		clearInterval(loadingTimer);

		var pos = JQ.fn.fancybox.getViewport();

		JQ("#fancy_loading").css({'left': ((pos[0] - 40) / 2 + pos[2]), 'top': ((pos[1] - 40) / 2 + pos[3])}).show();
		JQ("#fancy_loading").bind('click', JQ.fn.fancybox.close);

		loadingTimer = setInterval(JQ.fn.fancybox.animateLoading, 66);
	};

	JQ.fn.fancybox.close = function() {
		busy = true;

		JQ(imagePreloader).unbind();

		JQ("#fancy_overlay, #fancy_close").unbind();

		if (opts.hideOnContentClick) {
			JQ("#fancy_wrap").unbind();
		}

		JQ("#fancy_close, .fancy_loading, #fancy_left, #fancy_right, #fancy_title").hide();

		if (opts.centerOnScroll) {
			JQ(window).unbind("resize scroll");
		}

		__cleanup = function() {
			JQ("#fancy_overlay, #fancy_outer").hide();

			if (opts.centerOnScroll) {
				JQ(window).unbind("resize scroll");
			}

			if (isIE) {
				JQ('embed, object, select').css('visibility', 'visible');
			}

			if (JQ.isFunction(opts.callbackOnClose)) {
				opts.callbackOnClose();
			}

			busy = false;
		};

		if (JQ("#fancy_outer").is(":visible") !== false) {
			if (opts.zoomSpeedOut > 0 && opts.itemArray[opts.itemCurrent].orig !== undefined) {
				var orig_item	= opts.itemArray[opts.itemCurrent].orig;
				var orig_pos	= JQ.fn.fancybox.getPosition(orig_item);

				var itemOpts = {
					'left':		(orig_pos.left - 18) + 'px',
					'top': 		(orig_pos.top  - 18) + 'px',
					'width':	JQ(orig_item).width(),
					'height':	JQ(orig_item).height()
				};

				if (opts.zoomOpacity) {
					itemOpts.opacity = 'hide';
				}

				JQ("#fancy_outer").stop(false, true).animate(itemOpts, opts.zoomSpeedOut, opts.easingOut, __cleanup);

			} else {
				JQ("#fancy_outer").stop(false, true).fadeOut("fast", __cleanup);
			}

		} else {
			__cleanup();
		}

		return false;
	};

	JQ.fn.fancybox.build = function() {
		var html = '';

		html += '<div id="fancy_overlay"></div>';

		html += '<div id="fancy_wrap">';

		html += '<div class="fancy_loading" id="fancy_loading"><div></div></div>';

		html += '<div id="fancy_outer">';

		html += '<div id="fancy_inner">';

		html += '<div id="fancy_close"></div>';

		html +=  '<div id="fancy_bg"><div class="fancy_bg fancy_bg_n"></div><div class="fancy_bg fancy_bg_ne"></div><div class="fancy_bg fancy_bg_e"></div><div class="fancy_bg fancy_bg_se"></div><div class="fancy_bg fancy_bg_s"></div><div class="fancy_bg fancy_bg_sw"></div><div class="fancy_bg fancy_bg_w"></div><div class="fancy_bg fancy_bg_nw"></div></div>';

		html +=  '<a href="javascript:;" id="fancy_left"><span class="fancy_ico" id="fancy_left_ico"></span></a><a href="javascript:;" id="fancy_right"><span class="fancy_ico" id="fancy_right_ico"></span></a>';

		html += '<div id="fancy_content"></div>';

		html +=  '<div id="fancy_title"></div>';

		html += '</div>';

		html += '</div>';

		html += '</div>';

		JQ(html).appendTo("body");

		JQ('<table cellspacing="0" cellpadding="0" border="0"><tr><td class="fancy_title" id="fancy_title_left"></td><td class="fancy_title" id="fancy_title_main"><div></div></td><td class="fancy_title" id="fancy_title_right"></td></tr></table>').appendTo('#fancy_title');

		if (isIE) {
			JQ("#fancy_inner").prepend('<iframe class="fancy_bigIframe" scrolling="no" frameborder="0"></iframe>');
			JQ("#fancy_close, .fancy_bg, .fancy_title, .fancy_ico").fixPNG();
		}
	};

	JQ.fn.fancybox.defaults = {
		padding				:	10,
		imageScale			:	true,
		zoomOpacity			:	false,
		zoomSpeedIn			:	0,
		zoomSpeedOut		:	0,
		zoomSpeedChange		:	300,
		easingIn			:	'swing',
		easingOut			:	'swing',
		easingChange		:	'swing',
		frameWidth			:	425,
		frameHeight			:	355,
		overlayShow			:	true,
		overlayOpacity		:	0.3,
		hideOnContentClick	:	true,
		centerOnScroll		:	true,
		itemArray			:	[],
		callbackOnStart		:	null,
		callbackOnShow		:	null,
		callbackOnClose		:	null
	};

	JQ(document).ready(function() {
		JQ.fn.fancybox.build();
	});

})(jQuery);