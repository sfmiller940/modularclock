var clockID = 0;
var times = new Array(3);
var fiftynine=59;
var twentyfour=24;
var timeVars = ['secs', 'mins', 'hours'];

function modular_clock_init(){
	
	//plan to loop a lot-- make generic iterator that accept functions
	function timeVarsLoop(func){
		$.each(timeVars, function(index, value) { 	
			func(value);
		});
	}
	
	//Add divs for hours, mins, secs.	
	$('#modular_clock').append('<div id="hours" class="third"></div><div id="mins" class="third"></div><div id="secs" class="third"></div>');
	
	/*
	for (i=0; i < 54; i++){
		$.each(timeVars, function(index, value) { 	
			$('#'+value).append('<div class="box box_' + value + '"></div>')
		});
	}
	*/
	
	var a = function addDivs(id) {
		$('#'+id).append('<div class="box box_' + id + '"></div>')
	}
	for (i=0; i < 54; i++){
		timeVarsLoop(a);
	}
	
	
	//Add select inputs.
	var b = function selectBox(id) {
		var options
		for (i=10; i>1; i--) {options += '<option value="' + i + '">' + i + '</option>';}
		dv = '<div class="box_mod"><select id="mod_' + id + '">' + options + '</div>';
		$('#'+id).append(dv);
	}
	
	timeVarsLoop(b);
	/*
	$.each(timeVars, function(index, value) { 	
		selectBox(value);
	});
	*/
	

	
	//Start the clock
	modular_clock_update(1);
}


function modular_clock_update( refresh ){
	
	//alert('modular_clock_update');
	
	//Clear the clock.
	if(clockID) {
	  clearTimeout(clockID);
	  clockID  = 0;
	}
	
	//If refresh == 1, reset styles.
	if (refresh == 1){
		for (i=0; i < 54; i++){
			$.each(timeVars, function(index, value) { 	
				document.getElementById(value).childNodes[i].className="box box_"+value;
			});
		}
	}

	//Make and pad array of times.
	var tDate = new Date();
	times[0] = tDate.getSeconds().toString( $('#mod_secs').val() );
	times[1] = tDate.getMinutes().toString( $('#mod_mins').val() );
	times[2] = tDate.getHours().toString( $('#mod_hours').val() );
	
	for(i=0;i<3;i++){
		for (j=times[i].length;j<6;j++){
			times[i] = "0" + times[i];
	    }
	}

	//Clock object 
	function Clock(id, number, zeroTest, k, eq) {
		this.id = id;
		this.zeroTest = ( zeroTest || refresh == 1);
		this.k = k;
		this.eq = eq;
		this.mod = '#mod_' + id;
		this.i_condition = $(this.mod).val() - 1;
		this.j_condition = number.toString( $(this.mod).val() ).length - 1;
		
		console.log(this.eq)
		
		this.childIndex = function(i,j){
			return this.k - j - ( 6 * i );
		}
		
		this.toggleClassName = function(i,j){
			return "box box_"+((this.eq(i,j)) ? "on" : "off");
		}
		
		this.toggleClass = function(i,j){
			document.getElementById(this.id).childNodes[this.childIndex(i,j)].className=this.toggleClassName(i,j);
		}
		
		this.updateOnes = function(){
			for(i=0; i < this.i_condition; i++){
				this.toggleClass(i,0);
			}
		}
		
		this.updateColumns = function() {
			if (this.zeroTest){
				for (i=0; i < this.i_condition; i++){
					for (j=0; j < this.j_condition; j++){
						this.toggleClass(i,j);
					}
				}
			}	
		}		
	}
	
	 
	var ones = new Clock( 'secs', '', '', 53, function (i,j) {return i < times[0][5]} );
	var secs = new Clock( 'secs', fiftynine, (times[0][5] == 0), 52, function (i,j) {return i < times[0][ ( 4-j ) ]} );
	var mins = new Clock( 'mins', fiftynine, (times[0] == "000000"), 53, function (i,j) {return i < times[1][ ( 5-j ) ]} );
	var hours = new Clock( 'hours', twentyfour, (times[1] == "000000"), 53, function (i,j) {return i < times[2][ ( 5-j ) ]} );
	
	ones.updateOnes();
	secs.updateColumns();
	mins.updateColumns();
	hours.updateColumns();

	//Update clock in one second.
	clockID = setTimeout(function(){ modular_clock_update(0); }, 1000);
}
