function ModularClock(baseMax){


	//
	// Key Arguments
	//
	this.keyArgs = function(){
		
		// Basic variables.
		this.baseMin = 2;
		this.baseMax = baseMax;
		this.rows = baseMax - 1;


		// Class for time units
		this.keyTimeUnits = {
			units: ['secs', 'mins', 'hours' /* ,'milliseconds', 'days', 'months',years'*/],
			unitLimit: [59, 59, 23],
			getTime: [function(x){return x.getSeconds();}, function(x){return x.getMinutes();}, function(x){return x.getHours();}]
			// "getTime" property should probably instantiate a time class
			// ... anything else we want to add that is unit-specific ... //
		};
		// Loop through units.
		this.timeUnitsLoop = function(func){
			$.each(this.keyTimeUnits.units, function(index, value) { 	
				func(value);
			});
		}
		
		// Calculate # of columns
		this.keyTimeUnits.maxCols = new Array();
		for (i=0; i<this.keyTimeUnits.unitLimit.length; i++) {
			this.keyTimeUnits.maxCols[i] = this.keyTimeUnits.unitLimit[i].toString(this.baseMin).length;
		}
		this.cols = Math.max.apply(Math, this.keyTimeUnits.maxCols); // We should use maxCols for each unit, not same cols for every unit.

		// Various keys.
		this.getKeys = function(timeUnit){	
			
			k = this.keyTimeUnits
			
			// package up keys
			this.idx = k.units.indexOf(timeUnit);
			this.unitLimit = k.unitLimit[this.idx];
			this.base = $('#mod_' + timeUnit).val();							// Max rows, per base number
			this.width = this.unitLimit.toString( this.base ).length; 			// Max width, per time unit
			
			// now package the times
			var tDate = new Date();
			fnUnitsConvert = this.keyTimeUnits.getTime[this.idx];
			time = fnUnitsConvert(tDate).toString( this.base );
			this.time = this.padTime(time, this.cols);
			this.time_array = this.time.split('');
		}
		
		// Pad a time string to appropriate length.	
		this.padTime = function(t){
			while (t.length < this.cols){
				t = "0" + t;
			}
			return t
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
		for (r=keyArgs.rows; r>0; r--){
			for (c=0; c<keyArgs.cols; c++){
				dv += '<div class="box box_' + id + ' row' + r + ' col'+c + '"></div>'
			}
		}
		$('#'+id).append(dv)
	}
	keyArgs.timeUnitsLoop(createChildDivs);

	// Add select inputs
	var createSelects = function selectFn(id) {
		var options
		j=0
		for (i=keyArgs.baseMax; i>=keyArgs.baseMin; i--) {
			options += '<option value="' + i + '" ' + ((j=0) ? ' selected="select"' : '' +'>') + i + '</option>';
			j++
		}
		var dv = '<div class="box_mod"><select id="mod_' + id + '" class="selectpicker" data-style="btn-inverse">' + options + '</div>';
		$('#'+id).append(dv);
	}
	keyArgs.timeUnitsLoop(createSelects);
	
	// Update clock on change of mod
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
			/* Div classes are as follows on the UI:
				[row(x) col0] ...[row(x) col(y)]
				...
				[row1 col0]	...	[row1 col(y)]   */

			// Get keys values.
			this.id = id;	
			keyArgs.getKeys(this.id);
			
			// jQuery selector for below loops
			this.selectClasses = function(row, column){
				return $('#' + this.id + ' div.row' + row + '.col' + column);  
			}
						
			// Darken all divs relevant to clock's base number
			for (row=1; row < keyArgs.base; row++){
				for (column=1; column <= keyArgs.width; column++){
					c = keyArgs.cols - column										//columns count left-to-right, but the clock reads right-to-left.. reverse it.
					$(this.selectClasses(row,c)).addClass("box_off");
				}
			}
			// Lighten divs according to time
			for (column=0; column < keyArgs.time_array.length; column++){ 				
				for (row=1; row <= parseInt(keyArgs.time_array[column]); row++){
					$(this.selectClasses(row,column)).removeClass("box_off").addClass("box_on");
				}
			}
			
		}
		keyArgs.timeUnitsLoop(divUpdate);
		
		// Update clock in one second
		clockID = setTimeout(function(){ update(0); }, 1000);

	}


}
