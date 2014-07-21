function ModularClock(clockDivID, baseMax, clockWidth, clockHeight, outerMarg, innerMarg){


	//
	// Key Arguments - Should be singleton?
	//
	this.keyArgs = function(){
		
		// Basic variables.
		this.baseMin = 2;
		this.baseMax = baseMax; // Doesn't work for greater than 10.
		this.rows = baseMax - 1;

		// Class for time units
		this.timeUnits = {
			units: ['years','months', 'days','hours','mins','secs'], // milliseconds are next.
			unitLimit: [99, 12, 31, 23, 59, 59],
			getTime: [function(x){return (x.getFullYear() % 100);}, function(x){return (x.getMonth() + 1);}, function(x){return x.getDate();}, function(x){return x.getHours();}, function(x){return x.getMinutes();}, function(x){return x.getSeconds();}],
		};

		// For looping through units.
		this.timeUnitsLoop = function(func){
			$.each(this.timeUnits.units, function(index, unit) { 	
				func(index, unit);
			});
		}
		
		// Calculate height/width of unit divs.
		this.timeUnits.unitWidth = (clockWidth / this.timeUnits.units.length) - ( 2 * outerMarg);
		this.timeUnits.unitHeight = clockHeight - (2 * outerMarg);

		// Calculate # of columns and box height/width for each unit
		this.timeUnits.boxHeight = ((this.timeUnits.unitHeight - 100) / this.rows) - (2 * innerMarg);
		this.timeUnits.boxWidth = new Array();
		this.timeUnits.maxCols = new Array();
		for (i=0; i<this.timeUnits.units.length; i++) {
			this.timeUnits.maxCols[i] = this.timeUnits.unitLimit[i].toString(this.baseMin).length;
			this.timeUnits.boxWidth[i] = (this.timeUnits.unitWidth / this.timeUnits.maxCols[i]) - ( 2 * innerMarg);
		}

		// Variables dependent on time and active base.
		this.getUnitVars = function(unit){	

			// Package keys. Should be part of timeUnits, updated on change of mod?
			this.idx = this.timeUnits.units.indexOf(unit);
			this.base = $('#mod_' + unit).val();							// Max rows, per base number
			this.width = this.timeUnits.unitLimit[this.idx].toString( this.base ).length; 			// Max width, per time unit

			// Package time.
			var tDate = new Date();
			time = this.timeUnits.getTime[this.idx](tDate).toString( this.base );
			while (time.length < this.timeUnits.maxCols[this.idx]) { time = "0" + time; }
			this.time_array = time.split('').reverse();
		}

	}


	//
	// Initiate Clock
	//
	var timerID = 0;
	var keyArgs = new this.keyArgs();

	// Set height and width of clock div.
	$(clockDivID).css({ 'width': clockWidth + 'px', 'height': clockHeight + 'px' });

	// Append unit container divs
	keyArgs.timeUnitsLoop( function(index, unit){
			$(clockDivID).append('<div id="'+ unit +'">');
	});
	$(clockDivID + " div").css({ 'width': keyArgs.timeUnits.unitWidth + 'px', 'height': keyArgs.timeUnits.unitHeight + 'px', "margin" : outerMarg + 'px' });
	$(clockDivID + " div").addClass("unit");

	// Append child divs
	keyArgs.timeUnitsLoop( function(index, unit) {
		var dv='';
		for (r=keyArgs.rows - 1; r >=0; r--){
			for (c=keyArgs.timeUnits.maxCols[index] - 1; c>=0; c--){
				dv += '<div class="box box_' + unit + ' row' + r + ' col'+c + '"></div>'
			}
		}
		$(clockDivID + ' #' + unit).append(dv)
		$(clockDivID + " #"+ unit + " .box").css({ 'width': keyArgs.timeUnits.boxWidth[index] + 'px', 'height': keyArgs.timeUnits.boxHeight + 'px', "margin" : innerMarg + 'px' });
	});

	// Append select inputs
	keyArgs.timeUnitsLoop( function(index, unit) {
		var options;
		j=0;
		for (i=keyArgs.baseMax; i>=keyArgs.baseMin; i--) {
			options += '<option value="' + i + '" ' + ((j=0) ? ' selected="select"' : '' +'>') + i + '</option>';
			j++;
		}
		var dv = '<div class="box_mod"><select id="mod_' + unit + '" class="selectpicker" data-style="btn-inverse">' + options + '</div>';
		$(clockDivID + ' #'+ unit).append(dv);
	});
	
	// Update clock on change of base.
	$(document).ready(function(e) {
		$('.selectpicker').selectpicker().on('change', function(){ updateClock(1); });
	});

	// Start the clock
	updateClock(1);


	//
	// Update Clock.
	//
	function updateClock( refresh ){

		// Clear the timer
		if(timerID) {
		  clearTimeout(timerID);
		  timerID  = 0;
		}
		
		// Reset classes on change of mod.
		if (refresh == 1){ $('div.box').removeClass('box_on').removeClass('box_off'); }
		
		// Update divs
		keyArgs.timeUnitsLoop( function(index, unit){

			// Get keys values.
			keyArgs.getUnitVars(unit);
			
			// jQuery selector for below loops
			function selectClasses (row, column){ return $(clockDivID + ' #' + unit + ' div.row' + row + '.col' + column); }
						
			// Darken or lighten divs according to time
			for (column=0; column < keyArgs.width; column++){ 
				for (row=0; row < keyArgs.base - 1; row++){
					if( row < parseInt(keyArgs.time_array[ column ]) )
						{ $(selectClasses(row,column)).removeClass("box_off").addClass("box_on"); }
					else{ $(selectClasses(row,column)).removeClass("box_on").addClass("box_off"); }
				}
			}	
		});
		
		// Update clock in one second
		timerID = setTimeout(function(){ updateClock(0); }, 1000);
	}


}
