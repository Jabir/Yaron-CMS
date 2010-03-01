//<![CDATA[

    google.load('search', '1');

	function OnLoad() {
	  // create a search control
	  var searchControl = new google.search.SearchControl();
	
	  // create a draw options object so that we
	  // can position the search form root
	  var options = new google.search.DrawOptions();
	  options.setSearchFormRoot(document.getElementById("searchForm"));
	   // Add in a WebSearch
 	  var webSearch = new google.search.WebSearch();

	  // Restrict our search to pages from the avansopen site
	  webSearch.setSiteRestriction('adva.avansopen.nl');
		
	  searchControl.draw(document.getElementById("searchResults"), options);
	  
	}
google.setOnLoadCallback(OnLoad);

//]]>
  
