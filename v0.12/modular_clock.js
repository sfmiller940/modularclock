function ModularClock(baseMax){


	//
	// Key Arguments - Should be singleton?
	//
	this.keyArgs = function(){
		
		// Basic variables.
		this.baseMin = 2;
		this.baseMax = baseMax; // Doesn't work except for 10 yet.
		this.rows = baseMax - 1;

		// Class for time units
		this.timeUnits = {
			units: ['secs', 'mins', 'hours' /* ,'milliseconds', 'days', 'months',years'*/],
			unitLimit: [59, 59, 23],
			getTime: [function(x){return x.getSeconds();}, function(x){return x.getMinutes();}, function(x){return x.getHours();}]
		};

		// For looping through units.
		this.timeUnitsLoop = function(func){
			$.each(this.timeUnits.units, function(index, value) { 	
				func(value);
			});
		}
		
		// Calculate # of columns
		this.timeUnits.maxCols = new Array();
		for (i=0; i<this.timeUnits.unitLimit.length; i++) {
			this.timeUnits.maxCols[i] = this.timeUnits.unitLimit[i].toString(this.baseMin).length;
		}
		this.cols = Math.max.apply(Math, this.timeUnits.maxCols); // We should use maxCols for each unit, not same cols for every unit.

		// Keys dependent on time and active base.
		this.getKeys = function(timeUnit){	

			// Package keys.
			this.idx = this.timeUnits.units.indexOf(timeUnit);
			this.base = $('#mod_' + timeUnit).val();							// Max rows, per base number
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
	var clockID = 0;
	var keyArgs = new this.keyArgs();

	// Append unit container divs
	$('#modular_clock').append('<div id="hours"></div><div id="mins"></div><div id="secs"></div>')
	$("div div").addClass("third");

	// Append child divs
	var createChildDivs = function(id) {
		var dv='';
		for (r=keyArgs.rows - 1; r >=0; r--){
			//for (c=keyArgs.timeUnits.maxCols[keyArgs.timeUnits.units.indexOf(id)] - 1; c>=0; c--){
			for (c=keyArgs.cols - 1; c>=0; c--){
				dv += '<div class="box box_' + id + ' row' + r + ' col'+c + '"></div>'
			}
		}
		$('#'+id).append(dv)
	}
	keyArgs.timeUnitsLoop(createChildDivs);

	// Append select inputs
	var createSelects = function(id) {
		var options;
		j=0;
		for (i=keyArgs.baseMax; i>=keyArgs.baseMin; i--) {
			options += '<option value="' + i + '" ' + ((j=0) ? ' selected="select"' : '' +'>') + i + '</option>';
			j++;
		}
		var dv = '<div class="box_mod"><select id="mod_' + id + '" class="selectpicker" data-style="btn-inverse">' + options + '</div>';
		$('#'+id).append(dv);
	}
	keyArgs.timeUnitsLoop(createSelects);
	
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

		// Clear the clock
		if(clockID) {
		  clearTimeout(clockID);
		  clockID  = 0;
		}
		
		// Reset classes on change of mod.
		if (refresh == 1){ $('div.box').removeClass('box_on').removeClass('box_off'); }
		
		// Update divs
		var divUpdate = function(id){

			// Get keys values.
			keyArgs.getKeys(id);
			
			// jQuery selector for below loops
			function selectClasses (row, column){ return $('#' + id + ' div.row' + row + '.col' + column); }
						
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
		}
		keyArgs.timeUnitsLoop(divUpdate);
		
		// Update clock in one second
		clockID = setTimeout(function(){ updateClock(0); }, 1000);
	}


}