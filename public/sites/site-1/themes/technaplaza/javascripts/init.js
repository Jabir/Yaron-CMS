<script type="text/javascript">
    $(function(){
      $(".containerPlus").buildContainers({
        containment:"parent",
        elementsPath:"elements/"
      });

    });
	$(function(){
		$("#g1").mbMaskGallery({
			type:"normal",
			galleryMask:"mask/monitor.png",
			galleryUrl:"",
			galleryColor:"black",
			galleryLoader:"loader/loader_black.gif",
			loaderOpacity:.3,
			loader:true,
			fadeTime: 500,
			slideTimer: 6000,
			changeOnClick:true,
			navId:"" //nav1
		});

		
	});
	    $(function() {
		$("#datepicker").datepicker();
	});
	
     <!--
	var query = new Object();
	window.location.search.replace(
	new RegExp( "([^?=&]+)(=([^&]*))?", 'g' ),
		function( $0, $1, $2, $3 ){
			query[ $1 ] = $3;
		}
	);
	easing = query['e'] || 'Expo';
	
	function loadEasing(e) {
		location.href = location.pathname+'?e='+e;
	}
	
	function setEasing(e) {
		loadLamps(e);
	}

// for dynamic easing changes		
	function loadLamps(easing) {
		$('#lavaLampBasicImage').lavaLamp({
			fx: 'easeInOut'+easing,
			speed: 800,
			homeTop:-1,
			homeLeft:-1
		});
	}
	
// jquery initialize:
	$(function() {
		$('#menu').lavaLamp({fx: 'swing', speed: 333});
		loadLamps(easing);
		
		$('select#easing option[value='+easing+']').attr('selected','selected');
		$('.easingLabel').text(easing);
	});


//console.log();
-->
      
  </script>