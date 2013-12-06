
	google.load("search", "1");
	var imageSearch;
	var lineColor;

	var canvas = $("#myCanvas")[0];
	var ctx= canvas.getContext("2d");

	//color picker stuff
	$("#full").spectrum({
	    color: "#ECC",
	    change: function(color){
	    	if(color){
	    		lineColor = color.toHexString();
	    		/*console.log(lineColor);*/
	    	}
	    },
	    showInput: true,
	    className: "full-spectrum",
	    showInitial: true,
	    showPalette: true,
	    showSelectionPalette: true,
	    maxPaletteSize: 10,
	    preferredFormat: "hex",
	    localStorageKey: "spectrum.demo",
	    move: function (color) {
	        
	    },
	    show: function () {
	    
	    },
	    beforeShow: function () {
	    
	    },
	    hide: function () {
	    
	    },
	    palette: [
	        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
	        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
	        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
	        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
	        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
	        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
	        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
	        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
	        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
	        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
	        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
	        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
	        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
	        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
	    ]
	});

	//stroke properties
	ctx.lineCap = "round";
	var lineWidth = 1;

	//mouse x y pos
	var currentMouse = { x:-1, y:-1 };
	var lastMouse = { x:-1, y:-1 };

	//to account for margin
	var xOffSet = 16;
	var yOffset = 16;


	var wordlist = [];
	var total;

	//error handling for mouseclicks off canvas
	var nonCanvasClick = false;

	
	$(function(){

		//read wordlist into an array on pageload
		//wordlist courtesy of http://www.curlewcommunications.co.uk/wordlist.html
		var file = $.get('http://p3.dwakeat.biz/wordlist/brit-a-z.txt', function(text){
				
				var lines = text.split('\n');
				total = lines.length;
				for (i=0; i < lines.length; i++){
					wordlist[i] = lines[i];
				}
		});	

		//instructions animations

		$('#inspire_instruct').fadeIn(2000, function(){
			$('#inspire_instruct').fadeOut(3000);
			$('#tool_instruct').fadeIn(2000, function(){
				$('#tool_instruct').fadeOut(3000);
				$('#save_instruct').fadeIn(2000).fadeOut(4000);
			});
		})

	})
	
	

	//gets mouse position on every mouse move
	$(document).mousemove(function(event){
		
		lastMouse.x = currentMouse.x;
		lastMouse.y = currentMouse.y;
		currentMouse.x = event.pageX - xOffSet;
		currentMouse.y = event.pageY - yOffset;
	});

	$(document).mousedown(function(){
		nonCanvasClick = true;
	})

	//draw when mouse is held down
	$('#myCanvas').mousedown(function(){
			timeout= setInterval(function(){
				ctx.beginPath();
				ctx.moveTo(lastMouse.x, lastMouse.y);
				ctx.lineTo(currentMouse.x, currentMouse.y);
				ctx.strokeStyle = lineColor;
				ctx.lineWidth=lineWidth;
				ctx.stroke();
			}, .1);
			return false;
	});

	$(document).mouseup(function(){
		if (nonCanvasClick === false){
			clearInterval(timeout);
			return false;
		}
		nonCanvasClick = false;	

	});


	//toolbox events

	$("#width").change(function(){
		lineWidth =  $("#width").val();
		console.log(lineWidth)
	});

	// Google search functions

	function searchComplete(){

		//clear #example
			$('#example').empty();

		if(imageSearch.results && imageSearch.results.length > 0){

			//console.log(imageSearch.results);
			
			var results = imageSearch.results;

			//get a random result
			var randomImage = Math.floor(Math.random()*results.length);
			var result = results[randomImage];

			var newImg = document.createElement('img');

			//error checking not working currently 12/6
			try{
				newImg.src = result.url;
			}catch(e){
				console.log(e);
			}
			

			$('#example').append(newImg);
		}
		else{
			$('#example').text('no results');
		}
	}

	function imgSearch(term){

		imageSearch = new google.search.ImageSearch();
		
		imageSearch.setSearchCompleteCallback(this, searchComplete, null);
		//error checking not working currently 12/6
		try{
			imageSearch.execute(term);
		} catch (e){
			console.log(e);
		}

		
		//google.search.Search.getBranding('branding');
	}
	//google.setOnLoadCallback(search);

	//end Google functions


	//button functions
	
	$("#random").click(function(){
		$('#random').html("<p>Get another</p>");
		// gets a random number
		var randomNumber = Math.floor(Math.random()*total);
		//gets a random word from wordlist
		var query = wordlist[randomNumber];
		
		imgSearch(query);
		$('#display').text(wordlist[randomNumber]);

	});

	$("#save").click(function(){

		var dataURL = canvas.toDataURL();
		window.open(dataURL);
	});
