
    /*****************************************************************************
    The sIFR configuration should typically go in `sifr-config.js`, but in order to
    keep the config file clean, and to give a quick overview, it's done here instead.
    *****************************************************************************/
  
	 var drawzer = { 
	 src: 'http://db199.weserve.nl/sites/site-2/themes/technaplaza/flash/drawzer.swf' 
      ,ratios: [7, 1.32, 11, 1.31, 13, 1.24, 14, 1.25, 19, 1.23, 27, 1.2, 34, 1.19, 42, 1.18, 47, 1.17, 48, 1.18, 69, 1.17, 74, 1.16, 75, 1.17, 1.16]
    };

    sIFR.useStyleCheck = true;
    sIFR.activate(drawzer);

    sIFR.replace(drawzer, {
      selector: '.applynow, .blog_normal'
      ,css: [
        '.sIFR-root { color: #FF0000;padding-top:10px; }'
        ,'a { color: #C2054A; text-decoration: none; }'
        ,'a:link { color: #C2054A; text-decoration: none; }'
        ,'a:hover { color: #C2054A; text-decoration: none; }'
		,'a:selected { color: #B2054A; text-decoration: none; }'
      ]
	  ,offsetTop:0
	  ,marginBottom: 0
	  ,verticalSpacing: 0
	  ,wmode: 'transparent'
	  
    });
	
	var drawzer2 = { 
	src: 'http://db199.weserve.nl/sites/site-2/themes/technaplaza/flash/drawzer2.swf' 
      ,ratios: [7, 1.32, 11, 1.31, 13, 1.24, 14, 1.25, 19, 1.23, 27, 1.2, 34, 1.19, 42, 1.18, 47, 1.17, 48, 1.18, 69, 1.17, 74, 1.16, 75, 1.17, 1.16]
    };

	sIFR.useStyleCheck = true;
	sIFR.activate(drawzer2);

    sIFR.replace(drawzer2, {
      selector: '.fixed_black'
      ,css: [
        '.sIFR-root { color: #FFFFFF;padding-top:10px; }'
        ,'a { color: #FFFFFF; text-decoration: none; }'
        ,'a:link { color: #FFFFFF; text-decoration: none; }'
        ,'a:hover { color: #FFFFFF; text-decoration: none; }'
		,'a:selected { color: #FFFFFF; text-decoration: none; }'
      ]
	  ,offsetTop:0
	  ,marginBottom: 0
	  ,verticalSpacing: 0
	  ,wmode: 'transparent'
	  //,forceSingleLine: true
    });
	
	var cronos = { 
	 src: 'http://db199.weserve.nl/sites/site-2/themes/technaplaza/flash/cronos.swf' 
      ,ratios: [7, 1.32, 11, 1.31, 13, 1.24, 14, 1.25, 19, 1.23, 27, 1.2, 34, 1.19, 42, 1.18, 47, 1.17, 48, 1.18, 69, 1.17, 74, 1.16, 75, 1.17, 1.16]
    };

    sIFR.useStyleCheck = true;
    sIFR.activate(cronos);

    sIFR.replace(cronos, {
      selector: '.technaplaza, .technaplaza-logo'
      ,css: [
        '.sIFR-root { color: #FFFFFF;}'
        ,'a { color: #B2FFFF; text-decoration: none; }'
        ,'a:link { color: #B2FFFF; text-decoration: none; }'
        ,'a:hover { color: #FFFFFF; text-decoration: none; }'
		,'a:selected { color: #FFFFFF; text-decoration: none; }'
      ]
	  ,offsetTop:0
	  ,marginBottom: 0
	  ,verticalSpacing: 0
	  ,wmode: 'transparent'
	  ,forceSingleLine: true
	  
    });
	
var drawzer_head = { 
	src: 'http://db199.weserve.nl/sites/site-2/themes/technaplaza/flash/drawzer.swf' 
      ,ratios: [7, 1.32, 11, 1.31, 13, 1.24, 14, 1.25, 19, 1.23, 27, 1.2, 34, 1.19, 42, 1.18, 47, 1.17, 48, 1.18, 69, 1.17, 74, 1.16, 75, 1.17, 1.16]
    };

	sIFR.useStyleCheck = true;
	sIFR.activate(drawzer_head);

    sIFR.replace(drawzer_head, {
      selector: '.head_button'
      ,css: [
        '.sIFR-root { color: #FFFFFF;padding-top:10px; }'
        ,'a { color: #FFFFFF; text-decoration: none; }'
        ,'a:link { color: #FFFFFF; text-decoration: none; }'
        ,'a:hover { color: #F70446; text-decoration: underline; }'
		,'a:selected { color: #B2054A; text-decoration: underline; }'
      ]
	  ,offsetTop:0
	  ,marginBottom: 0
	  ,verticalSpacing: 0
	  ,wmode: 'transparent'
	  ,forceSingleLine: true
	  	  
    });
	
	
	
			 var acidic = { 
	 src: 'http://db199.weserve.nl:3000/sites/site-2/themes/technaplaza/flash/acidic.swf' 
      ,ratios: [7, 1.32, 11, 1.31, 13, 1.24, 14, 1.25, 19, 1.23, 27, 1.2, 34, 1.19, 42, 1.18, 47, 1.17, 48, 1.18, 69, 1.17, 74, 1.16, 75, 1.17, 1.16]
    };

    sIFR.useStyleCheck = true;
    sIFR.activate(acidic);

    sIFR.replace(acidic, {
      selector: 'h6'
      ,css: [
        '.sIFR-root { color: #FFFFFF; background-color:#000000 }'
        ,'a { color: #B2FFFF; text-decoration: none; }'
        ,'a:link { color: #ffffff; text-decoration: none; }'
        ,'a:hover { color: #ffffff; text-decoration: none; }'
		,'a:selected { color: #ffffff; text-decoration: none; }'
      ]
	  ,offsetTop:0
	  ,marginBottom: 0
	  ,verticalSpacing: 0
	  ,wmode: 'transparent'
    });
	
				 var castiron = { 
	 src: 'http://db199.weserve.nl:3000/sites/site-2/themes/technaplaza/flash/castiron.swf' 
      ,ratios: [7, 1.32, 11, 1.31, 13, 1.24, 14, 1.25, 19, 1.23, 27, 1.2, 34, 1.19, 42, 1.18, 47, 1.17, 48, 1.18, 69, 1.17, 74, 1.16, 75, 1.17, 1.16]
    };

    sIFR.useStyleCheck = true;
    sIFR.activate(castiron);

    sIFR.replace(castiron, {
      selector: '.cowboy'
      ,css: [
        '.sIFR-root { color: #000000; }'
        ,'a { color: #00000; text-decoration: none; }'
        ,'a:link { color: #ffffff; text-decoration: none; }'
        ,'a:hover { color: #ffffff; text-decoration: none; }'
		,'a:selected { color: #ffffff; text-decoration: none; }'
      ]
	  ,offsetTop:0
	  ,marginBottom: 0
	  ,verticalSpacing: 0
	  ,wmode: 'transparent'
	  
    });
