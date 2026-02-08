// lunr.js search code
//vanilla js version of https://gist.github.com/sebz/efddfc8fdcb6b480f567

	 var lunrIndex,
	     $results,
         $search,
         $searchForm,
	     pagesIndex;

	 // Initialize lunrjs using our generated index file
	 function initLunr() {
	     var request = new XMLHttpRequest();
         request.open('GET', '/index.json', true);

	     //request.onload = function () {
	     request.onreadystatechange = function () {
         if (request.status >= 200 && request.status < 400) {
           pagesIndex = JSON.parse(request.responseText);
           // console.log("index:", pagesIndex.length);

           // Set up lunrjs by declaring the fields we use
           // Also provide their boost level for the ranking
           lunrIndex = lunr(function () {
             this.field("title", {
                 boost: 10
             });
             this.field("tags", {
                 boost: 5
             });
             this.field("content");

             // ref is the result item identifier (I chose the page URL)
             this.ref("href");
             this.add({ field: "test", text: 'hello' });
             for (var i = 0; i < pagesIndex.length; ++i) {
                 this.add(pagesIndex[i]);
             }
           });

           } else {
             //var err = textStatus + ", " + error;
             //console.error("Error getting Hugo index file:", err);
             //console.log("request.status: " + request.status);
           }
	     };

	     request.send();
	 }

    function doSearch() {
       while ($results.firstChild) {
           $results.removeChild($results.firstChild);
       }

       // Only trigger a search when 2 chars. at least have been provided
       var query = $search.value;
       if (query.length < 2) {
               var matchLength = document.getElementById('matches');
               matchLength.innerText = "";
           return;
       }

       var results = search(query);
       renderResults(results);
       return false;
    }

	 // Nothing crazy here, just hook up a event handler on the input field
	 function initUI() {
	     $results = document.getElementById("results");
	     $search = document.getElementById("search");
       $searchForm = document.getElementById("searchForm");
       if (!$results || !$search || !$searchForm) {
         return false;
       }

       /*
          We have JS! Adjust our search inputs to use Lunr...
          Basically, change placeholder text, remove 'name' attr,
          and remove the hidden input sites input field entirely
       */
       $search.placeholder = "Enter search terms";
       $search.removeAttribute("name");
       var searchSite = document.getElementById("searchsite");
       if (searchSite && searchSite.parentNode === $searchForm) {
         $searchForm.removeChild(searchSite);
       }
       $searchForm.action = "#";
       $searchForm.removeAttribute("action");

       $search.onkeyup =  doSearch;
       $searchForm.onsubmit = doSearch;
       return true;
	 }

	 /**
	  * Trigger a search in lunr and transform the result
	  *
	  * @param  {String} query
	  * @return {Array}  results
	  */
	 function search(query) {
	     // Find the item in our index corresponding to the lunr one to have more info
	     // Lunr result:
	     //  {ref: "/section/page1", score: 0.2725657778206127}
	     // Our result:
	     //  {title:"Page1", href:"/section/page1", ...}
	     return lunrIndex.search(query).map(function (result) {
		 return pagesIndex.filter(function (page) {
		     return page.href === result.ref;
		 })[0];
	     });
	 }

	 /**
	  * Display the 10 first results
	  *
	  * @param  {Array} results to display
	  */
	 function renderResults(results) {

	     if (!results.length) {
         return;
	     }

	     // Only show the ten first results
       var matchLength = document.getElementById('matches');
       matchLength.innerText = "Found "+ results.length +" matches:";

	     //results.slice(0, 10).forEach(function (result) {
	     results.forEach(function (result) {
         var li = document.createElement('li');
         li.classList.add('mb-md-0');
         li.classList.add('mb-2');

         var ahref = document.createElement('a');
         ahref.href = result.href;
         ahref.text = result.title;

         // This adds the date after the post title
         var adate = document.createElement('small');
         adate.classList.add('text-secondary');
         var postDate = new Date( result.date );
         adate.innerText = " ("+ postDate.getFullYear()+"-"+ ('0'+postDate.getMonth()).slice(-2) +"-"+ ('0'+postDate.getDay()).slice(-2) +")";

         li.append(ahref);

         // Comment out below to remove date from result string
         li.append(adate);

         $results.appendChild(li);
       });
	 }

     function renderMermaidDiagrams() {
       if (typeof mermaid === "undefined") {
         return;
       }

       var mermaidBlocks = document.querySelectorAll("pre > code.language-mermaid, pre > code.lang-mermaid");
       if (!mermaidBlocks.length) {
         return;
       }

       mermaid.initialize({ startOnLoad: false });

       mermaidBlocks.forEach(function (codeBlock) {
         var pre = codeBlock.parentElement;
         if (!pre) {
           return;
         }

         var container = document.createElement("div");
         container.className = "mermaid";
         container.textContent = codeBlock.textContent;
         pre.replaceWith(container);
       });

       mermaid.run({ querySelector: ".mermaid" });
     }

	 document.addEventListener("DOMContentLoaded", function () {
	     if (initUI()) {
         initLunr();
       }
         renderMermaidDiagrams();
	 })
