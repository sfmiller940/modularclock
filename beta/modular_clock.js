var clockID = 0;
var times = new Array(3);

function modular_clock_init(){
	
	//Add divs for hours, mins, secs.
	$('#modular_clock').append('<div id="hours" class="third"></div><div id="mins" class="third"></div><div id="secs" class="third"></div>');
	for (i=0; i < 54; i++){
		$('#hours').append('<div class="box box_hour"></div>');
		$('#mins').append('<div class="box box_mins"></div>');
		$('#secs').append('<div class="box box_secs"></div>');
	}
	
	//Add select inputs.
	$('#hours').append('<div class="box_mod"><select id="mod_hours"><option value="10">10</option><option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option></select></div>');
	$('#mins').append('<div class="box_mod"><select id="mod_mins"><option value="10">10</option><option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option></select></div>');
	$('#secs').append('<div class="box_mod"><select id="mod_secs"><option value="10">10</option><option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option></select></div>');
	
	//Startup the clock
	modular_clock_update();
}



function modular_clock_update(){

	//Clear the clock.
	if(clockID) {
	  clearTimeout(clockID);
	  clockID  = 0;
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

	//Update seconds column.
	for(i=0; i < ( $('#mod_secs').val() - 1 ); i++){
		if ( i < times[0][5] ) { document.getElementById("secs").childNodes[ ( 53 - ( 6 * i ) ) ].className += " box_on"; }
		else{ document.getElementById("secs").childNodes[ ( 53 - ( 6 * i ) ) ].className = "box"; }
		}


	clockID = setTimeout("modular_clock_update()", 1000);
}