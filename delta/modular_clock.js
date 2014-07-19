function ModularClock(baseMax){


	// Key Arguments
	this.keyArgs = function(){
		
		// Update baseMax to 12 at some point.
		this.baseMin = 2;
		this.baseMax = baseMax;
		this.keyTimeUnits = {
			units: ['secs', 'mins', 'hours' /* ,'milliseconds', 'years', 'light years'*/],
			unitLimit: [59, 59, 23],
			getTime: [function(x){return x.getSeconds();}, function(x){return x.getMinutes();}, function(x){return x.getHours();}]
			// "getTime" property should probably instantiate a time class
			// ... anything else we want to add that is unit-specific ... //
		};
		
		// We loop through these id_names a bunch
		this.timeVarsLoop = function(func){
			$.each(this.keyTimeUnits.units, function(index, value) { 	
				func(value);
			});
		}
		
		// These should be hooked in with the css
		// So, the display can adjust depending on time units 
		var base = this.baseMin;
		var max = 0;
		this.keyTimeUnits.maxCols = new Array();
		for (i=0; i<this.keyTimeUnits.unitLimit.length; i++) {
			for (base=this.baseMin; base <= this.baseMax; base++) {
				j = this.keyTimeUnits.unitLimit[i].toString(base).length;
				if (max < j){
					max = j;
				}
				this.keyTimeUnits.maxCols[i] = max;
			}
		}
		
		this.cols = Math.max.apply(Math, this.keyTimeUnits.maxCols)				// Governed by largest clock number (59 base 2)
		this.rows = 9;  														// Governed by our number system														// Governed by Largest base
		this.divCount = this.rows * this.cols; 									// Unused

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
			
		this.padTime = function(t){
			while (t.length < this.cols){
				t = "0" + t;
			}
			return t
		}
		
	}

	// Update Clock.
	function update( refresh ){

		// Clear the clock
		if(clockID) {
		  clearTimeout(clockID);
		  clockID  = 0;
		}
		
		if (refresh == 1){
			$('div.box').removeClass('box_on').removeClass('box_off');
		}
		
		// **NEW** Clock object 
		function Clock(id){
			/*
			div classes are as follows on the UI:
			=============================
			[row(x) col0]	[row(x) col1]...[row(x) col(y)]
			.
			.
			.
			[row2 col0] 	[row2 col1]	...	[row2 col(y)]
			[row1 col0]		[row1 col1]	...	[row1 col(y)]
			
			They are now meant to be modular, so we can expand into other time_units
			*/
			this.id = id;	
			
			keyArgs.getKeys(this.id);
			
			// Builds proper jQuery selector for below loops
			this.selectClasses = function(row, column){
				return $('#' + this.id + ' div.row' + row + '.col' + column);  
			}
			
			/*  
			I use "row" and "column" words below for clarity
			*/
			
			// Darken all divs relevant to clock's base number
			for (row=1; row < keyArgs.base; row++){
				for (column=1; column <= keyArgs.width; column++){
					c = keyArgs.cols - column										//columns count left-to-right, but the clock reads right-to-left.. reverse it.
					$(this.selectClasses(row,c)).addClass("box_off");
				}
			}
			
			// Lighten divs according to time
			// We should add back the "skip" functionality this for certain classes/parameters 
			for (column=0; column < keyArgs.time_array.length; column++){ 				
				for (row=1; row <= parseInt(keyArgs.time_array[column]); row++){
					$(this.selectClasses(row,column)).removeClass("box_off").addClass("box_on");
				}
			}
			
		}
		
		var secs = new Clock('secs');
		var mins = new Clock('mins');
		var hours = new Clock('hours');
		
		// Update clock in one second
		clockID = setTimeout(function(){ update(0); }, 1000);

	}


	// Initiate Clock
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
	keyArgs.timeVarsLoop(createChildDivs);

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
	keyArgs.timeVarsLoop(createSelects);
	
	// Update clock on change of mod
	$(document).ready(function(e) {
	  $('.selectpicker').selectpicker()
						.on('change', function(){update(1);});
	});

	// Start the clock
	update(1);

}