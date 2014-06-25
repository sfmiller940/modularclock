var clockID = 0;
var times = new Array(3);
var fiftynine=59;
var twentyfour=24;

//We loop through these id_names a bunch
function timeVarsLoop(func){
	$.each(['secs', 'mins', 'hours'], function(index, value) { 	
		//console.log(func);
		func(value);
	});
}

function modular_clock_init(){
	
	var childDivs = function childDivsFn(id) {
		$('#'+id).append('<div class="box box_' + id + '"></div>')
	}
	var selects = function selectFn(id) {
		var options
		for (i=10; i>1; i--) {
			options += '<option value="' + i + '">' + i + '</option>';
		}
		dv = '<div class="box_mod"><select id="mod_' + id + '">' + options + '</div>';
		$('#'+id).append(dv);
	}
	
	//Add divs for hours, mins, secs.	
	$('#modular_clock').append('<div id="hours"></div><div id="mins"></div><div id="secs"></div>')
	$("div div").addClass("third");
	
	//Create child divs
	for (i=0; i < 54; i++){timeVarsLoop(childDivs);}
		
	//Add select inputs.
	timeVarsLoop(selects);
	
	//Start the clock
	modular_clock_update(1);
}


function modular_clock_update( refresh ){
	
	//Clear the clock.
	if(clockID) {
	  clearTimeout(clockID);
	  clockID  = 0;
	}
	
	if (refresh == 1){
		timeVarsLoop(function styleResetFunc(id){$('[class*="box box"]').attr('class', "box box_"+id)});
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
	function Clock(id, number, zeroTest, k, toggleClassNameCondition) {
		this.id = id;
		this.zeroTest = ( zeroTest || refresh == 1);
		this.k = k;
		this.toggleClassNameCondition = toggleClassNameCondition;
		this.mod = '#mod_' + id;
		this.i_condition = $(this.mod).val() - 1;
		this.j_condition = number.toString( $(this.mod).val() ).length - 1;
		
		this.childIndex = function(i,j){
			return this.k - j - ( 6 * i );
		}
		
		this.toggleClassName = function(i,j){
			return "box box_"+((this.toggleClassNameCondition(i,j)) ? "on" : "off");
		}
		
		this.toggleClass = function(i,j){
			document.getElementById(this.id)
					.childNodes[this.childIndex(i,j)]
					.className=this.toggleClassName(i,j);
		}
		
		this.updateOnes = function(){
			for(i=0; i < this.i_condition; i++){
				this.toggleClass(i,0);
			}
		}
		
		this.updateColumns = function(){
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
