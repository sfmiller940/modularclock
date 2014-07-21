function ModularClock(clockDivID, baseMax, clockWidth, clockHeight, outerMarg, innerMarg){


	//
	// Key Arguments - Should be singleton?
	//
	this.keyArgs = function(){
		
		// Basic variables.
		this.baseMin = 2;
		this.baseMax = baseMax; // Doesn't work yet, except for 10.
		this.rows = baseMax - 1;

		// Class for time units
		this.timeUnits = {
			units: ['hours','mins','secs'], // milliseconds, days, months, years...
			unitLimit: [23, 59, 59],
			getTime: [function(x){return x.getHours();}, function(x){return x.getMinutes();}, function(x){return x.getSeconds();}]
		};

		// For looping through units.
		this.timeUnitsLoop = function(func){
			$.each(this.timeUnits.units, function(index, unit) { 	
				func(unit);
			});
		}
		
		// Calculate # of columns
		this.timeUnits.maxCols = new Array();
		for (i=0; i<this.timeUnits.unitLimit.length; i++) {
			this.timeUnits.maxCols[i] = this.timeUnits.unitLimit[i].toString(this.baseMin).length;
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
			this.time_array = time.split('');
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
	keyArgs.timeUnitsLoop( function(unit){
			$(clockDivID).append('<div id="'+ unit +'">');
	});
	var unitWidth = (clockWidth / keyArgs.timeUnits.units.length) - ( 2 * outerMarg);
	var unitHeight = clockHeight - (2 * outerMarg);
	$(clockDivID + " div").css({ 'width': unitWidth + 'px', 'height': unitHeight + 'px', "margin" : outerMarg + 'px' });
	$(clockDivID + " div").addClass("unit");

	// Append child divs
	keyArgs.timeUnitsLoop( function(unit) {
		var dv='';
		for (r=keyArgs.rows - 1; r >=0; r--){
			for (c=keyArgs.timeUnits.maxCols[keyArgs.timeUnits.units.indexOf(unit)] - 1; c>=0; c--){
				dv += '<div class="box box_' + unit + ' row' + r + ' col'+c + '"></div>'
			}
		}
		$(clockDivID + ' #' + unit).append(dv)
		var boxWidth = (unitWidth / keyArgs.timeUnits.maxCols[keyArgs.timeUnits.units.indexOf(unit)]) - ( 2 * innerMarg);
		var boxHeight = ((unitHeight - 100) / keyArgs.rows) - (2 * innerMarg);
		$(clockDivID + " #"+ unit + " .box").css({ 'width': boxWidth + 'px', 'height': boxHeight + 'px', "margin" : innerMarg + 'px' });

	});

	// Append select inputs
	keyArgs.timeUnitsLoop( function(unit) {
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
	  $('.selectpicker').selectpicker()
						.on('change', function(){updateClock(1);});
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
		keyArgs.timeUnitsLoop( function(unit){

			// Get keys values.
			keyArgs.getUnitVars(unit);
			
			// jQuery selector for below loops
			function selectClasses (row, column){ return $(clockDivID + ' #' + unit + ' div.row' + row + '.col' + column); }
						
			// Darken all divs relevant to clock's base number
			for (column=0; column < keyArgs.width; column++){
				for (row=0; row < keyArgs.base - 1; row++){
					$(selectClasses(row,column)).removeClass("box_on").addClass("box_off");
				}
			}
			// Lighten divs according to time
			for (column=0; column < keyArgs.width; column++){ 
				for (row=0; row < parseInt(keyArgs.time_array[keyArgs.time_array.length - column - 1]); row++){
					$(selectClasses(row,column)).removeClass("box_off").addClass("box_on");
				}
			}	
		});
		
		// Update clock in one second
		timerID = setTimeout(function(){ updateClock(0); }, 1000);
	}


}