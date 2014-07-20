function ModularClock(baseMax){


	//
	// Key Arguments - Should be singleton?
	//
	this.keyArgs = function(){
		
		// Basic variables.
		this.baseMin = 2;
		this.baseMax = baseMax;
		this.rows = baseMax - 1;


		// Class for time units
		this.timeUnits = {
			units: ['secs', 'mins', 'hours' /* ,'milliseconds', 'days', 'months',years'*/],
			unitLimit: [59, 59, 23],
			getTime: [function(x){return x.getSeconds();}, function(x){return x.getMinutes();}, function(x){return x.getHours();}]
			// "getTime" property should probably instantiate a time class
			// ... anything else we want to add that is unit-specific ... //
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
			fnUnitsConvert = this.timeUnits.getTime[this.idx];
			time = fnUnitsConvert(tDate).toString( this.base );
			while (time.length < this.timeUnits.maxCols[this.idx]) { time = "0" + time; }
			this.time_array = time.split('');
		}
		
	}


	//
	// Initiate Clock
	//
	var clockID = 0;
	var keyArgs = new this.keyArgs();

	// Add divs for hours, mins, secs
	$('#modular_clock').append('<div id="hours"></div><div id="mins"></div><div id="secs"></div>')
	$("div div").addClass("third");

	// Create child divs
	var createChildDivs = function childDivsFn(id) {
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

	// Add select inputs
	var createSelects = function selectFn(id) {
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
						.on('change', function(){update(1);});
	});

	// Start the clock
	update(1);


	//
	// Update Clock.
	//
	function update( refresh ){

		// Clear the clock
		if(clockID) {
		  clearTimeout(clockID);
		  clockID  = 0;
		}
		
		// Reset classes on change of mod.
		if (refresh == 1){
			$('div.box').removeClass('box_on').removeClass('box_off');
		}
		
		// Update divs
		var divUpdate = function divUpdateFn(id){

			// Get keys values.
			this.id = id;	
			keyArgs.getKeys(this.id);
			
			// jQuery selector for below loops
			this.selectClasses = function(row, column){
				return $('#' + this.id + ' div.row' + row + '.col' + column);  
			}
						
			// Darken all divs relevant to clock's base number
			for (column=0; column < keyArgs.width; column++){
				for (row=0; row < keyArgs.base - 1; row++){
					$(this.selectClasses(row,column)).addClass("box_off");
				}
			}
			// Lighten divs according to time
			for (column=0; column < keyArgs.width; column++){ 
				for (row=0; row < parseInt(keyArgs.time_array[keyArgs.time_array.length - column - 1]); row++){
					$(this.selectClasses(row,column)).removeClass("box_off").addClass("box_on");
				}
			}
			
		}
		keyArgs.timeUnitsLoop(divUpdate);
		
		// Update clock in one second
		clockID = setTimeout(function(){ update(0); }, 1000);

	}


}