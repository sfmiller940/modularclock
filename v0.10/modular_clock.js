var clockID = 0;
var times = new Array(3);
var fiftynine=59;
var twentythree=23;


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
	
	$('#mod_hours, #mod_mins, #mod_secs').change(function(){modular_clock_update(1);});
	
	//Start the clock
	modular_clock_update(1);
}



function modular_clock_update( refresh ){

	//Clear the clock.
	if(clockID) {
	  clearTimeout(clockID);
	  clockID  = 0;
	}
	
	//If refresh == 1, reset styles.
	if (refresh == 1){
		for (i=0; i < 54; i++){
			document.getElementById("secs").childNodes[ i ].className="box box_secs";
			document.getElementById("mins").childNodes[ i ].className="box box_mins";
			document.getElementById("hours").childNodes[ i ].className="box box_hours";
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

	//Update seconds 'ones' column.
	for(i=0; i < ( $('#mod_secs').val() - 1 ); i++){
		if ( i < times[0][5] ) { document.getElementById("secs").childNodes[ ( 53 - ( 6 * i ) ) ].className = "box box_on"; }
		else{ document.getElementById("secs").childNodes[ ( 53 - ( 6 * i ) ) ].className = "box box_off"; }
		}

	//Update other seconds columns if ones digit is zero or refresh == 1.
	if ( times[0][5] == 0 || refresh == 1) {
		for(i=0; i < ( $('#mod_secs').val() - 1 ); i++){
			for (j=0; j < ( fiftynine.toString( $('#mod_secs').val() ).length - 1); j++){
				if ( i < times[0][ ( 4 - j ) ] ) { document.getElementById("secs").childNodes[ ( 52 - j - ( 6 * i ) ) ].className = "box box_on"; }
				else{ document.getElementById("secs").childNodes[ ( 52 - j - ( 6 * i ) ) ].className = "box box_off"; }
			}
		}
	}

	//Update minute columns if seconds are zeros or refresh == 1.
	if ( times[0] == "000000" || refresh ==  1) {
		for(i=0; i < ( $('#mod_mins').val() - 1 ); i++){
			for (j=0; j < fiftynine.toString( $('#mod_mins').val() ).length ; j++){
				if ( i < times[1][ ( 5 - j ) ] ) { document.getElementById("mins").childNodes[ ( 53 - j - ( 6 * i ) ) ].className = "box box_on"; }
				else{ document.getElementById("mins").childNodes[ ( 53 - j - ( 6 * i ) ) ].className = "box box_off"; }
			}
		}
	}

	//Update hours columns if minutes are zeros or refresh == 1.
	if ( times[1] == "000000" || refresh == 1) {
		for(i=0; i < ( $('#mod_hours').val() - 1 ); i++){
			for (j=0; j< twentythree.toString( $('#mod_hours').val() ).length ; j++){
				if ( i < times[2][ ( 5 - j ) ] ) { document.getElementById("hours").childNodes[ ( 53 - j - ( 6 * i ) ) ].className = "box box_on"; }
				else{ document.getElementById("hours").childNodes[ ( 53 - j - ( 6 * i ) ) ].className = "box box_off"; }
			}
		}
	}



	//Update clock in one second.
	clockID = setTimeout(function(){ modular_clock_update(0); }, 1000);
}
