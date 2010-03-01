/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2009. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: info@pupunzi.com
 site: http://pupunzi.com
 Licences: MIT, GPL
 ******************************************************************************/

/*
 * Name:jquery.mb.containerPlus
 * Version: 2.4
 * dependencies: UI.core.js, UI.draggable.js, UI.resizable.js
 */

(function($){

  //manage the container position when windowresize
  var winw=$(window).width();
  var winh=$(window).height();
  $.doOnWindowResize=function(el){
    clearTimeout(this.doRes);
    this.doRes=setTimeout(function(){
      $(el).adjastPos();
      winw=$(window).width();	winh=$(window).height();
    },400);
  };

  $.fn.adjastPos= function(margin){
    clearTimeout(this.doRes);
    var opt=$(this).attr("options");
    if (!opt.mantainOnWindow) return;
    if(!margin) margin=20;
    var nww=$(window).width();
    var nwh=$(window).height();
    this.each(function(){
      if (($(this).offset().left+$(this).outerWidth())>nww || ($(this).offset().top+$(this).outerHeight())>nwh){
        var l=($(this).offset().left+$(this).outerWidth())>nww ? nww-$(this).outerWidth()-margin: $(this).offset().left;
        var t= ($(this).offset().top+$(this).outerHeight())>nwh ? nwh-$(this).outerHeight()-margin: $(this).offset().top;
        t=(t>0)?t:0;
        $(this).animate({left:l, top:t},650);
      }
    });
  };

  jQuery.fn.buildContainers = function (options){
    var el=this;
    return this.each (function (){
      if ($(this).is("[inited=true]")) return;
      this.options = {
        containment:"document",
        elementsPath:"elements/",
        onCollapse:function(){},
        onBeforeIconize:function(){},
        onIconize:function(){},
        onClose: function(){},
        onResize: function(){},
        onDrag: function(){},
        onRestore:function(){},
        onLoad:function(){},
        mantainOnWindow:true,
        collapseEffect:"slide", //or "fade"
        effectDuration:300
      };
      $.extend (this.options, options);
      if (this.options.mantainOnWindow)
        $(window).resize(function(){$.doOnWindowResize(el);});
      var container=$(this);

      container.attr("inited","true");
      container.attr("iconized","false");
      container.attr("collapsed","false");
      container.attr("closed","false");
      container.attr("options",this.options);
      if (!container.css("position")=="absolute")
        container.css({position: "relative"});

      if ($.metadata){
        $.metadata.setType("class");
        if (container.metadata().skin) container.attr("skin",container.metadata().skin);
        if (container.metadata().collapsed) container.attr("collapsed",container.metadata().collapsed);
        if (container.metadata().iconized) container.attr("iconized",container.metadata().iconized);
        if (container.metadata().icon) container.attr("icon",container.metadata().icon);
        if (container.metadata().buttons) container.attr("buttons",container.metadata().buttons);
        if (container.metadata().content) container.attr("content",container.metadata().content); //ajax
        if (container.metadata().aspectRatio) container.attr("aspectRatio",container.metadata().aspectRatio); //ui.resize
        if (container.metadata().grid) container.attr("grid",container.metadata().grid); //ui.grid
        if (container.metadata().gridx) container.attr("gridx",container.metadata().gridx); //ui.grid
        if (container.metadata().gridy) container.attr("gridy",container.metadata().gridy); //ui.grid
        if (container.metadata().handles) container.attr("handles",container.metadata().handles); //ui.resize
        if (container.metadata().dock) container.attr("dock",container.metadata().dock);
        if (container.metadata().closed) container.attr("closed",container.metadata().closed);
        if (container.metadata().rememberMe) container.attr("rememberMe",container.metadata().rememberMe);

        if (container.metadata().width) container.attr("width",container.metadata().width);
        if (container.metadata().height) container.attr("height",container.metadata().height);
      }

      if (container.attr("rememberMe")=="true"){
        container.attr("width" , container.mb_getCookie("width")!=null? container.mb_getCookie("width"):container.attr("width") );
        container.attr("height", container.mb_getCookie("height")!=null? container.mb_getCookie("height"):container.attr("height") );
        container.attr("closed", container.mb_getCookie("closed")!=null? container.mb_getCookie("closed"):container.attr("closed") );
        container.attr("collapsed", container.mb_getCookie("collapsed")!=null? container.mb_getCookie("collapsed"):container.attr("collapsed") );
        container.attr("iconized", container.mb_getCookie("iconized")!=null? container.mb_getCookie("iconized"):container.attr("iconized") );

        container.css("left", container.mb_getCookie("x")!=null? container.mb_getCookie("x"):container.css("left") );
        container.css("top", container.mb_getCookie("y")!=null? container.mb_getCookie("y"):container.css("top") );
      }

      if (container.attr("content"))
        container.mb_changeContainerContent(container.attr("content"));

      container.addClass(container.attr("skin"));
      container.find(".n:first").attr("unselectable","on");
      if (!container.find(".n:first").html()) container.find(".n:first").html("&nbsp;");
      container.containerSetIcon(container.attr("icon"), this.options.elementsPath);
      if (container.attr("buttons")) container.containerSetButtons(container.attr("buttons"),this.options);
      container.css({width:"99.9%"});

      if (container.attr("width")){
        var cw= $.browser.msie? container.attr("width"):container.attr("width")+"px";
        container.css({width:cw});
      }

     // if (!container.attr("height") && $.browser.safari) container.attr("height",container.outerHeight()+10);
      if (container.attr("height")){
        container.find(".c:first , .mbcontainercontent:first").css("height",container.attr("height")-container.find(".n:first").outerHeight()-(container.find(".s:first").outerHeight()));
      }else if ($.browser.safari){
        container.find(".mbcontainercontent:first").css("padding-bottom",5);
      }

/*      var nwh=$(window).height();
      if (container.outerHeight()>nwh)
        container.find(".c:first , .mbcontainercontent:first").css("height",(nwh-20)-container.find(".n:first").outerHeight()-(container.find(".s:first").outerHeight()));
*/
      if (container.hasClass("draggable")){
        //var pos=this.options.containment=="parent"?"relative":"absolute";
        var pos="absolute";
        container.css({position:pos, margin:0});
        container.find(".n:first").css({cursor:"move"});
        container.mb_BringToFront();
        container.draggable({
          handle:".n:first",
          delay:0,
          containment:this.options.containment,
          stop:function(){
            var opt=$(this).attr("options");
            if(opt.onDrag) opt.onDrag($(this));
            if (container.attr("rememberMe")){
              container.mb_setCookie("x",container.css("left"));
              container.mb_setCookie("y",container.css("top"));
            }
          }
        });
        if (container.attr("grid") || (container.attr("gridx") && container.attr("gridy"))){
          var grid= container.attr("grid")? [container.attr("grid"),container.attr("grid")]:[container.attr("gridx"),container.attr("gridy")];
          container.draggable('option', 'grid', grid);
        }
        container.bind("mousedown",function(){
          $(this).mb_BringToFront();
        });
      }
      if (container.hasClass("resizable")){
        container.containerResize();
      }
      if (container.attr("collapsed")=="true"){
        container.attr("collapsed","false");
        container.containerCollapse(this.options);
      }
      if (container.attr("iconized")=="true"){
        container.attr("iconized","false");
        container.containerIconize(this.options);
      }

      if (container.mb_getState('closed')){
        container.attr("closed","false");
        container.mb_close();
      }

      setTimeout(function(){
        var opt= container.attr("options");
        if (opt.onLoad) {
          opt.onLoad(container);
        }
        container.css("visibility","visible");
        container.adjastPos();
      },1000);
    });
  };

  jQuery.fn.containerResize = function (){

    var container=$(this);
    var isDraggable=container.hasClass("draggable");
    var handles= container.attr("handles")?container.attr("handles"):"s";
    var aspectRatio= container.attr("aspectRatio")?container.attr("aspectRatio"):false;

    container.resizable({
      handles:isDraggable ? "":handles,
      aspectRatio:aspectRatio,
      minWidth: 350,
      minHeight: 150,
      iframeFix:true,
      helper: "mbproxy",
      start:function(e,o){
        $(container).resizable('option', 'maxHeight',$(window).height()-($(container).offset().top)-5);
        $(container).resizable('option', 'maxWidth',$(window).width()-$(container).offset().left-5);
        o.helper.mb_BringToFront();
      },
      stop:function(){
        var resCont= $(this);//$.browser.msie || Opera ?o.helper:
        var elHeight= resCont.outerHeight()-container.find(".n:first").outerHeight()-(container.find(".s:first").outerHeight());
        container.find(".c:first , .mbcontainercontent:first").css({height: elHeight});
        if (!isDraggable && !container.attr("handles")){
          var elWidth=container.attr("width") && container.attr("width")>0 ?container.attr("width"):"99.9%";
          container.css({width: elWidth});
        }
        var opt=container.attr("options");
        if(opt.onResize) opt.onResize(container);
        if (container.attr("rememberMe")){
          container.mb_setCookie("width",container.outerWidth());
          container.mb_setCookie("height",container.outerHeight());
        }
      }
    });
    container.resizable('option', 'maxHeight', $("document").outerHeight()-(container.offset().top+container.outerHeight())-10);

    /*
     *TO SOLVE UI CSS CONFLICT I REDEFINED A SPECIFIC CLASS FOR HANDLERS
     */

    container.find(".ui-resizable-n").addClass("mb-resize").addClass("mb-resize-resizable-n");
    container.find(".ui-resizable-e").addClass("mb-resize").addClass("mb-resize-resizable-e");
    container.find(".ui-resizable-w").addClass("mb-resize").addClass("mb-resize-resizable-w");
    container.find(".ui-resizable-s").addClass("mb-resize").addClass("mb-resize-resizable-s");
    container.find(".ui-resizable-se").addClass("mb-resize").addClass("mb-resize-resizable-se");

  };

  jQuery.fn.containerSetIcon = function (icon,path){
    var container=$(this);
    if (icon && icon!="" ){
      container.find(".ne:first").prepend("<img class='icon' src='"+path+"icons/"+icon+"' style='position:absolute'/>");
      container.find(".n:first").css({paddingLeft:25});
    }else{
      container.find(".n:first").css({paddingLeft:0});
    }
  };

  jQuery.fn.containerSetButtons = function (buttons,opt){
    var container=$(this);
    if (!opt) opt=container.attr("options");
    var path= opt.elementsPath;
    if (buttons !=""){
      var btn=buttons.split(",");
      container.find(".ne:first").append("<div class='buttonBar'></div>");
      for (var i in btn){
        if (btn[i]=="c"){
          container.find(".buttonBar:first").append("<img src='"+path+container.attr('skin')+"/close.png' class='close'/>");
          container.find(".close:first").bind("click",function(){
            container.mb_close();
            if (opt.onClose) opt.onClose(container);
          });
        }
        if (btn[i]=="m"){
          container.find(".buttonBar:first").append("<img src='"+path+container.attr('skin')+"/min.png' class='collapsedContainer'/>");
          container.find(".collapsedContainer:first").bind("click",function(){container.containerCollapse(opt);});
          container.find(".n:first").bind("dblclick",function(){container.containerCollapse(opt);});
        }
        if (btn[i]=="p"){
          container.find(".buttonBar:first").append("<img src='"+path+container.attr('skin')+"/print.png' class='printContainer'/>");
          container.find(".printContainer:first").bind("click",function(){});
        }
        if (btn[i]=="i"){
          container.find(".buttonBar:first").append("<img src='"+path+container.attr('skin')+"/iconize.png' class='iconizeContainer'/>");
          container.find(".iconizeContainer:first").bind("click",function(){container.containerIconize(opt);});
        }
      }
      var fadeOnClose=$.browser.mozilla || $.browser.safari;
      if (fadeOnClose) container.find(".buttonBar:first img")
              .css({opacity:.5, cursor:"pointer","mozUserSelect": "none", "khtmlUserSelect": "none"})
              .mouseover(function(){$(this).fadeTo(200,1);})
              .mouseout(function(){if (fadeOnClose)$(this).fadeTo(200,.5);});
      container.find(".buttonBar:first img").attr("unselectable","on");
    }
  };

  jQuery.fn.containerCollapse = function (opt){
    this.each (function () {
      var container=$(this);
      if (!opt) opt=container.attr("options");
      if (!container.mb_getState("collapsed")){
        container.attr("w" , container.outerWidth());
        container.attr("h" , container.outerHeight());
        if (opt.collapseEffect=="fade")
          container.find(".o:first").fadeOut(opt.effectDuration,function(){});
        else{
          container.find(".icon:first").hide();
          container.find(".o:first").slideUp(opt.effectDuration,function(){});
          container.animate({height:container.find(".n:first").outerHeight()+container.find(".s:first").outerHeight()},opt.effectDuration,function(){container.find(".icon:first").show();});
        }
        container.attr("collapsed","true");
        container.find(".collapsedContainer:first").attr("src",opt.elementsPath+container.attr('skin')+"/max.png");
        container.resizable("disable");
        if (opt.onCollapse) opt.onCollapse(container);

      }else{
        if (opt.collapseEffect=="fade")
          container.find(".o:first").fadeIn(opt.effectDuration,function(){});
        else{
          container.find(".o:first").slideDown(opt.effectDuration,function(){});
          container.find(".icon:first").hide();
          container.animate({height:container.attr("h")},opt.effectDuration,function(){container.find(".icon:first").show();});
        }
        if (container.hasClass("resizable")) container.resizable("enable");
        container.attr("collapsed","false");
        container.find(".collapsedContainer:first").attr("src",opt.elementsPath+container.attr('skin')+"/min.png");
        container.find(".mbcontainercontent:first").css("overflow","auto");
      }
      if (container.attr("rememberMe")) container.mb_setCookie("collapsed",container.mb_getState("collapsed"));
    });
  };

  jQuery.fn.containerIconize = function (opt){
    var container=$(this);
    if (!opt) opt=container.attr("options");
    return this.each (function (){
      if (opt.onBeforeIconize) opt.onBeforeIconize();
      container.attr("iconized","true");
      if(container.attr("collapsed")=="false"){
        container.attr("h",container.outerHeight());
      }
      container.attr("w",container.attr("width") && container.attr("width")>0 ? (!container.hasClass("resizable")? container.attr("width"):container.width()):!container.attr("handles")?"99.9%":container.width());
      container.attr("t",container.css("top"));
      container.attr("l",container.css("left"));
      container.resizable("disable");
      var l=0;
      var t= container.css("top");
      var dockPlace= container;
      if (container.attr("dock")){
        dockPlace = $("#"+container.attr("dock"));
        var icns= dockPlace.find("img").size();
        l=$("#"+container.attr("dock")).offset().left+(32*icns);
        t=$("#"+container.attr("dock")).offset().top;
      };
      /*
       ICONIZING CONTAINER
       */
      this.dockIcon= $("<img src='"+opt.elementsPath+"icons/"+(container.attr("icon")?container.attr("icon"):"restore.png")+"' class='restoreContainer' width='32'/>").appendTo(dockPlace)
              .css("cursor","pointer")
              .hide()
              .attr("contTitle",container.find(".n:first").text())
              .bind("click",function(){

        container.attr("iconized","false");
        if (container.is(".draggable"))
          container.css({top:$(this).offset().top, left:$(this).offset().left});
        else
          container.css({left:"auto",top:"auto"});
        container.show();

        if (!$.browser.msie) {
          container.find(".no:first").fadeIn("fast");
          if(container.attr("collapsed")=="false"){
            container.animate({height:container.attr("h"), width:container.attr("w"),left:container.attr("l"),top:container.attr("t")},opt.effectDuration,function(){
              container.find(".mbcontainercontent:first").css("overflow","auto");
              if(container.hasClass("draggable")) {
                container.mb_BringToFront();
              }
            });
            container.find(".c:first , .mbcontainercontent:first").css("height",container.attr("h")-container.find(".n:first").outerHeight()-(container.find(".s:first").outerHeight()));
          }
          else
            container.animate({height:"60px", width:container.attr("w"), left:container.attr("l"),top:container.attr("t")},opt.effectDuration);
        } else {
          container.find(".no:first").show();
          if(container.attr("collapsed")=="false"){
            container.css({height:container.attr("h"), width:container.attr("w"),left:container.attr("l"),top:container.attr("t")},opt.effectDuration);
            container.find(".c:first , .mbcontainercontent:first").css("height",container.attr("h")-container.find(".n:first").outerHeight()-(container.find(".s:first").outerHeight()));
          }
          else
            container.css({height:"60px", width:container.attr("w"),left:container.attr("l"),top:container.attr("t")},opt.effectDuration);
        }
        if (container.hasClass("resizable") && container.attr("collapsed")=="false") container.resizable("enable");
        $(this).remove();
        if(container.hasClass("draggable")) container.mb_BringToFront();
        $(".iconLabel").remove();
        container.attr("restored", true);
        if(opt.onRestore) opt.onRestore(container);
        if (container.attr("rememberMe")){
          container.mb_setCookie("restored",container.mb_getState("restored"));
          container.mb_setCookie("closed", false);
          container.mb_setCookie("iconized", false);
          container.mb_setCookie("collapsed", false);
        }
        if (opt.mantainOnWindow) $.doOnWindowResize(container);
      })
              .bind("mouseenter",function(){
        var label="<div class='iconLabel'>"+$(this).attr("contTitle")+"</div>";
        $("body").append(label);
        $(".iconLabel").hide().css({
          position:"absolute",
          top:$(this).offset().top-20,
          left:$(this).offset().left+15,
          opacity:.9
        }).fadeIn("slow").mb_BringToFront();
      })
              .bind("mouseleave",function(){
        $(".iconLabel").fadeOut("fast",function(){$(this).remove();});
      });

      if (!$.browser.msie) {
        container.find(".mbcontainercontent:first").css("overflow","hidden");
        container.find(".no:first").slideUp("fast");
        container.animate({ height:"32px", width:"32px",left:l,top:t},opt.effectDuration,function(){
          $(this.dockIcon).show();
          if (container.attr("dock")) container.hide();
        });
      }else{
        container.find(".no:first").hide();
        container.css({ height:"32px", width:"32px",left:l,top:t});
        $(this.dockIcon).show();
        if (container.attr("dock")) container.hide();
      }
      if (opt.onIconize) opt.onIconize(container);
      if (container.attr("rememberMe")) container.mb_setCookie("iconized",container.mb_getState("iconized"));
    });
  };

  jQuery.fn.mb_resizeTo = function (h,w,anim){
    if (anim || anim==undefined) anim=200;
    else
      anim=0;
    var container=$(this);
    if(container.mb_getState('closed') || container.mb_getState('iconized') ){
      if (w) container.attr("w",w);
      if (h) container.attr("h",h);
      if (container.attr("rememberMe")){
        container.mb_setCookie("width",container.attr("w"));
        container.mb_setCookie("height",container.attr("h"));
      }
      return;
    }
    if (!w) w=container.outerWidth();
    if (!h) h=container.outerHeight();
    var elHeight= h-container.find(".n:first").outerHeight()-(container.find(".s:first").outerHeight());
    container.find(".c:first , .mbcontainercontent:first").animate({height: elHeight},anim);
    container.animate({"height":h,"width":w},anim,function(){
      container.adjastPos();
      var opt=container.attr("options");
      if (opt.onResize) opt.onResize(container);
      if (container.attr("rememberMe")){
        container.mb_setCookie("width",container.outerWidth());
        container.mb_setCookie("height",container.outerHeight());
      }
    });
  };

  jQuery.fn.mb_iconize = function (){
    var container=$(this);
    var el=container.get(0);
    if (!container.mb_getState('closed')){
      if (container.mb_getState('iconized')){
        var icon=el.dockIcon;
        $(icon).click();
        container.mb_BringToFront();
      }else{
        container.containerIconize();
        if(el.options.onIconize) el.options.onIconize($(el));
      }
    }
    return container;
  };

  jQuery.fn.mb_open = function (url,data){
    var container=$(this);
    var t=Math.floor(container.attr("t"));
    var l=Math.floor(container.attr("l"));
    container.css("top",t).css("left",l);
    var el=container.get(0);
    if (container.mb_getState('closed')){
      if (url){
        if (!data) data="";
        container.mb_changeContainerContent(url,data);
      }
      if (!$.browser.msie) container.fadeIn(300);
      else container.show();

      container.attr("closed","false");
      if (container.attr("rememberMe")){
        container.mb_setCookie("closed",false);
        container.mb_setCookie("restored",true);
      }

      container.mb_BringToFront();
      container.attr("restored", true);

      if(!container.mb_getState("collapsed")){
        container.mb_resizeTo(container.attr("h"),container.attr("w"),false);
      }
      if(el.options.onRestore) el.options.onRestore($(el));
    }
    return container;
  };

  jQuery.fn.mb_close = function (){
    var el=$(this).get(0);
    var container=$(this);
    if (!container.mb_getState('closed') && !container.mb_getState('iconized')){
      if(!container.mb_getState('collapsed')){
        container.attr("w",container.outerWidth());
        container.attr("h",container.outerHeight());
        container.attr("t",container.offset().top);
        container.attr("l",container.offset().left);
      }
      if (!$.browser.msie) container.fadeOut(300);
      else container.hide();
    }
    if(el.options.onClose) el.options.onClose($(el));
    container.attr("closed","true");
    if (container.attr("rememberMe")) container.mb_setCookie("closed",true);
    return $(this);
  };

  jQuery.fn.mb_toggle = function (){
    if (!$(this).mb_getState('closed') && !$(this).mb_getState('iconized')){
      $(this).containerCollapse();
    }
    return $(this);
  };

  jQuery.fn.mb_BringToFront= jQuery.fn.mb_bringToFront= function(){
    var zi=10;
    $('*').each(function() {
      if($(this).css("position")=="absolute"){
        var cur = parseInt($(this).css('zIndex'));
        zi = cur > zi ? parseInt($(this).css('zIndex')) : zi;
      }
    });
    $(this).css('zIndex',zi+=1);
    return zi;
  }
          ;

  jQuery.fn.mb_changeContent= function(url, data){
    var where=$(this);
    if (!data) data="";
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function(html){
        where.html(html);
      }
    });
  };

  jQuery.fn.mb_changeContainerContent=function(url, data){
    $(this).find(".mbcontainercontent:first").mb_changeContent(url,data);
  };

  jQuery.fn.mb_getState= function(attr){
    var state = $(this).attr(attr);
    state= state == "true";
    return state;
  };

  jQuery.fn.mb_fullscreen= function(){
    var container=$(this);
    if (container.mb_getState('iconized') || container.mb_getState('collapsed') || container.mb_getState('closed')){
      container.attr("w",$(window).width()-40);
      container.attr("h",$(window).height()-40);
      container.attr("t",20);
      container.attr("l",20);
      container.css("height","");
      return;
    }
    container.animate({top:20,left:20, position:"relative"},200, function(){
      if (container.attr("rememberMe")){
        container.mb_setCookie("x",$(this).css("left"));
        container.mb_setCookie("y",$(this).css("top"));
      }
    });
    container.mb_resizeTo($(window).height()-40,$(window).width()-40);

    container.attr("w",$(this).outerWidth());
    container.attr("h",$(this).outerHeight());
    container.attr("t",$(this).offset().top);
    container.attr("l",$(this).offset().left);
    container.css("height","");
    container.mb_bringToFront();
    return container;
  };

  jQuery.fn.mb_centerOnWindow=function(anim){
    var container=$(this);
    var nww=$(window).width();
    var nwh=$(window).height();
    var ow=container.outerWidth();
    var oh= container.outerHeight();
    var l= (nww-ow)/2;
    var t= ((nwh-oh)/2)>0?(nwh-oh)/2:10;
    if (anim)
      container.animate({top:t,left:l},300,function(){
        if (container.attr("rememberMe")){
          container.mb_setCookie("x",$(this).css("left"));
          container.mb_setCookie("y",$(this).css("top"));
        }
      });
    else{
      container.css({top:t,left:l});
      if (container.attr("rememberMe")){
        container.mb_setCookie("x",$(this).css("left"));
        container.mb_setCookie("y",$(this).css("top"));
      }
    }
    return container;
  };


  //COOKIES

  jQuery.fn.mb_setCookie = function(name,value,days) {
    var id=$(this).attr("id");
    if(!id) id="";
    if (days) {
      var date = new Date(), expires;
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"_"+id+"="+value+expires+"; path=/";
  };

  jQuery.fn.mb_getCookie = function(name) {
    var id=$(this).attr("id");
    if(!id) id="";
    var nameEQ = name+"_"+id + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  };

  jQuery.fn.mb_removeCookie = function(name) {
    $(this).createCookie(name,"",-1);
  };

})(jQuery);