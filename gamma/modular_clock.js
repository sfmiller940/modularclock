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

	function keyArgs(){
		/*
		var baseMin = 2;
		var baseMax = 10;
		var keyTimeUnits = {
			units: ['secs', 'mins', 'hours'],
			unitCount: [59, 59, 24],
			adjustment: [1, 0, 0]
		};
		var max_of_array = Math.max.apply(Math, keyTimeUnits.unitCount);
		var divCount;
		*/
		this.rows = 9;
		this.cols = 6;
		
		/*
		for (i=0, i < max_of_array, i++){
			(max_of_array).toString(
		}
		*/
			
			
	}

	var k = new keyArgs();
	
	console.log(k.rows);
	console.log(k.cols);
	/*
	for (r=k.rows; r>=0; r--){
		for (c=0; c<=k.cols; c++){
			console.log('c= '+c+'\tr= '+r);
		}
	}
	*/
	
	
	var childDivs = function childDivsFn(id) {
		$('#'+id).append('<div class="box box_' + id + '"></div>')
	}
	
	/*
	var childDivs = function childDivsFn(id) {
		var dv='';
		for (r=k.rows; r>0; r--){
			for (c=0; c<=k.cols; c++){
				console.log('c= '+c+'\tr= '+r);
				dv += '<div class="box box_' + id + ' row' + r + ' col'+c + '"></div>'
				//$('#'+id).append('<div class="box box_' + id + ' row' + r + ' col'+c + '"></div>')
			}
		}
		$('#'+id).append(dv)
	}
	*/
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
	//timeVarsLoop(childDivs);
		
	//Add select inputs.
	timeVarsLoop(selects);
	
	//Start the clock
	modular_clock_update(1);
}


function modular_clock_update( refresh ){
	
	console.log('clockID: '+clockID);
	
	//Clear the clock.
	if(clockID) {
	  clearTimeout(clockID);
	  clockID  = 0;
	}
	
	if (refresh == 1){
		timeVarsLoop(function styleResetFunc(id){$('#' + id + ' [class*="box box"]')
												.children()
												.attr('class', "box box_" + id)});
	}
		
	//Make and pad array of times.
	var tDate = new Date();
	times[0] = tDate.getSeconds().toString( $('#mod_secs').val() );
	times[1] = tDate.getMinutes().toString( $('#mod_mins').val() );
	times[2] = tDate.getHours().toString( $('#mod_hours').val() );
	
	/*
	t = times;
	console.log(t.reverse());
	*/
	for(i=0;i<3;i++){
		for (j=times[i].length;j<6;j++){
			times[i] = "0" + times[i];
	    }
	}
	
	console.log('[secs, mins, hours]: ' + times);
	
	//Clock object 
	function Clock(t, id, number, zeroTest, toggleClassNameCondition) {
		
		/*
		this.i_condition: row_lim
		this.j_condition: column_lim
		*/
		
		//console.log(refresh);
		//console.log('zeroTest: '+zeroTest);
		adj = (id =='mins') ? -1 : 0  // dirty adjuster for minutes class
		
		console.log('times: ' + t)
		this.number = number //for debug purposes
		
		this.id = id;
		this.zeroTest = ( zeroTest || refresh == 1);
		this.divCount = 53 + adj;
		this.toggleClassNameCondition = toggleClassNameCondition;
		this.mod = '#mod_' + id;
		this.i_condition = $(this.mod).val() - 1;
		this.j_condition = number.toString( $(this.mod).val() ).length + adj;
		
		console.log('\n this.id: '+this.id
			+'\n this.zeroTest: '+this.zeroTest
			+'\n this.divCount: '+this.divCount
			+'\n this.toggleClassNameCondition: '+this.toggleClassNameCondition
			+'\n this.mod: '+this.mod
			+'\n this.i_condition: '+this.i_condition
			+'\n this.j_condition: '+this.j_condition
		);
		
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
		
		this.toggleClass = function(i,j){
			console.log(this.id+'; '+this.number
				+ '\ni:' + i
				+ '\nj: ' + j
				+ '\nthis.childIndex(i,j): ' + this.childIndex(i,j)
				+ '\nthis.toggleClassName(i,j): ' + this.toggleClassName(i,j)
			);
			
			document.getElementById(this.id)
					.childNodes[this.childIndex(i,j)]
					.className=this.toggleClassName(i,j);
		}
		
		this.childIndex = function(i,j){
			//console.log('childIndex reached');
			return this.divCount - j - ( 6 * i );
		}
		
		this.toggleClassName = function(i,j){
			//console.log('this.toggleClassName: '+"box box_"+((this.toggleClassNameCondition(i,j)) ? "on" : "off"));
			return "box box_"+((this.toggleClassNameCondition(i,j)) ? "on" : "off");
		}
	}
	
	var ones = new Clock( times[0], 'secs', '', '', function (i,j) {return i < times[0][5]} );
	var secs = new Clock( times[0], 'secs', fiftynine, (times[0][5] == 0), function (i,j) {return i < times[0][ ( 4-j ) ]} );
	var mins = new Clock( times[1],'mins', fiftynine, (times[0] == "000000"), function (i,j) {return i < times[1][ ( 5-j ) ]} );
	var hours = new Clock( times[2],'hours', twentyfour, (times[1] == "000000"), function (i,j) {return i < times[2][ ( 5-j ) ]} );
	
	ones.updateOnes();
	secs.updateColumns();
	mins.updateColumns();
	hours.updateColumns();

	//Update clock in one second.
	clockID = setTimeout(function(){ modular_clock_update(0); }, 1000);

}
