<html>
<head>
<title>Modular Clock</title>
<meta name="Author" content="Stephen Francis Miller">


<script language="JavaScript">


// Multipurpose function that returns a random color.
function randcolor(){
	var rando=Math.floor( Math.random() * 16777216 ).toString(16);
	for (j=rando.length;j<6;j++){ rando = "0" + rando; }
	return rando;
	}
 



// ClockID for timers.
var clockID = 0;

// Functions to start and kill clock.
function StartClock() {
   clockID = setTimeout("UpdateClock()", 500);
}

function KillClock() {
   if(clockID) {
	  clearTimeout(clockID);
	  clockID  = 0;
   }
}
	


// Setup default mods for 0 hours, 1 minutes and 2 seconds.
var oldclockmod = new Array();
var clockmod = new Array();
clockmod[0]=10;
clockmod[1]=10;
clockmod[2]=10;

// So we can establish maxlength of strings for various mods.
var fiftynine=59;
var twentyfour=24;

// Set the blank cells to a random color.
var blanks = randcolor();

// Utility variable for potential use of mods greater than ten.
var newnum = "0123456789abcdef";


	
// Function that updates the clock.
function UpdateClock(){

	// Clear the timeout.
	if(clockID) {
		clearTimeout(clockID);
		clockID  = 0;
		}

	//Get current time.
	var tDate = new Date();
	var sec = tDate.getSeconds();
	var mns = tDate.getMinutes();
	var hor = tDate.getHours();
	
	//Convert time to strings of appropriate mod.
	var strbell = new Array(3);
	strbell[0] = hor.toString(clockmod[0]);
	strbell[1] = mns.toString(clockmod[1]);
	strbell[2] = sec.toString(clockmod[2]);

	//Pad time strings.
	for(i=0;i<3;i++){
		for (j=strbell[i].length;j<6;j++){
			strbell[i] = "0" + strbell[i];
			}
		}


	// Update the ones column for seconds.
	for (i=0; i<9; i++){
		if ((i < 10 - clockmod[2]) )
			{ document.getElementById('clocktable').rows[i].cells[17].bgColor="#"+ blanks ; }
		else{
			if (newnum.charCodeAt(9 - i) <= strbell[2].charCodeAt(5)) 
				{ document.getElementById('clocktable').rows[i].cells[17].bgColor="#ff0000";}
			else 
				{ document.getElementById('clocktable').rows[i].cells[17].bgColor="#666666"; }
			}
		}
	

	// Update the seconds columns if mod changes or if ones column is full.
	if( (oldclockmod[2] != clockmod[2]) || (strbell[2].charAt(5)=="0") ){
		oldclockmod[2] = clockmod[2];
		for (j=0; j<9; j++){
			for (k=0; k<5; k++){ 
				if ((j < 10 - clockmod[2]) || (k+2 > fiftynine.toString(clockmod[2]).length))
					{ document.getElementById('clocktable').rows[j].cells[16 - k].bgColor="#" + blanks; } 
				else{
					if (newnum.charCodeAt(9 - j) <= strbell[2].charCodeAt(4 - k))
						{ document.getElementById('clocktable').rows[j].cells[16 - k].bgColor="#ff0000";}
					else 
						{ document.getElementById('clocktable').rows[j].cells[16 - k].bgColor="#666666"; }
					}
				}
			}
		}
			
			
	// Update minutes if mod changes or if seconds are full.
	if( (oldclockmod[1] != clockmod[1]) || (strbell[2]=="000000") ){
		oldclockmod[1] = clockmod[1];
		// Change background color for fun.
		document.bgColor = "#" + randcolor() ;
		for (j=0; j<9; j++){
			for (k=0; k<6; k++){ 
				if ((j < 10 - clockmod[1]) || (k+1 > fiftynine.toString(clockmod[1]).length))
					{ document.getElementById('clocktable').rows[j].cells[11 - k].bgColor="#" + blanks; } 
				else{
					if (newnum.charCodeAt(9 - j) <= strbell[1].charCodeAt(5 - k))
						{ document.getElementById('clocktable').rows[j].cells[11 - k].bgColor="#00ff00";}
					else 
						{ document.getElementById('clocktable').rows[j].cells[11 - k].bgColor="#999999"; }
					}
				}
			}
		}
			

	// Update hours if mod changes or if minutes are full.
	if( (oldclockmod[0] != clockmod[0]) || (strbell[1]=="000000")){
		oldclockmod[0] = clockmod[0];
		for (j=0; j<9; j++){
			for (k=0; k<6; k++){ 
				if ((j < 10 - clockmod[0]) || (k+1 > twentyfour.toString(clockmod[0]).length))
					{ document.getElementById('clocktable').rows[j].cells[5 - k].bgColor="#" + blanks; } 
				else{
					if (newnum.charCodeAt(9 - j) <= strbell[0].charCodeAt(5 - k))
						{ document.getElementById('clocktable').rows[j].cells[5 - k].bgColor="#0000ff";}
					else 
						{ document.getElementById('clocktable').rows[j].cells[5 - k].bgColor="#cccccc"; }
					}
				}
			}
		
		// Change the color of the blank cells for fun.
		blanks = randcolor();
		
		}	
	
	// Set timeout to update the clock in a second.
	clockID = setTimeout("UpdateClock()", 1000);

	}

</script>

</head>
<body onload="StartClock()" onunload="KillClock()" topmargin="0" leftmargin="0" bottommargin="0" rightmargin="0" text="#000000" bgcolor="#000000">

<table height="100%" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle">

<table id="clocktable" cellspacing="5">

<?

// PHP Function that returns a random color.
function randcolor()
	{
	$color[0]='00';
	$color[1]='11';
	$color[2]='22';
	$color[3]='33';
	$color[4]='44';
	$color[5]='55';
	$color[6]='66';
	$color[7]='77';
	$color[8]='88';
	$color[9]='99';
	$color[10]='aa';
	$color[11]='bb';
	$color[12]='cc';
	$color[13]='dd';
	$color[14]='ee';
	$color[15]='ff';
	$rando=$color[rand(0,15)].$color[rand(0,15)].$color[rand(0,15)];
	return $rando;
	}

// Code for making the clock table.
$poibella_str = "*poibellaallepiod*";
$primez = array(5, 7, 11, 13);
$genny = $primez[rand(0,3)];
for ($i=0; $i < 9; $i++){
	echo("<tr>");
	for($j=0; $j < 18; $j++){
		$k= $i + 15 * $j;
		echo("<td name='cell". $k ."' align='center' valign='center' height='15' width='15' style='color: #". randcolor() .";'>". substr( $poibella_str, (( $i * $genny ) % 8  + $j) % 18 ,1) ."</td>");
		}
	echo("</tr>");
	}

?>

<tr>
	<td colspan="6" align="center" valign="center">
	<form name="hMod">
	<select name="hsel" onChange="clockmod[0] = document.hMod.hsel.options[document.hMod.hsel.selectedIndex].value">
	<OPTION value="2">2
	<OPTION value="3">3
	<OPTION value="4">4
	<OPTION value="5">5
	<OPTION value="6">6
	<OPTION value="7">7
	<OPTION value="8">8
	<OPTION value="9">9
	<OPTION value="10" SELECTED>10
	</select>
	</form>
	</td>
	<td colspan="6" align="center" valign="center">
	<form name="mMod">
	<select name="msel" onChange="clockmod[1] = document.mMod.msel.options[document.mMod.msel.selectedIndex].value">
	<OPTION value="2">2
	<OPTION value="3">3
	<OPTION value="4">4
	<OPTION value="5">5
	<OPTION value="6">6
	<OPTION value="7">7
	<OPTION value="8">8
	<OPTION value="9">9
	<OPTION value="10" SELECTED>10
	</select>
	</form>
	</td>
	<td colspan="6" align="center" valign="center">
	<form name="sMod">
	<select name="ssel" onChange="clockmod[2] = document.sMod.ssel.options[document.sMod.ssel.selectedIndex].value">
	<OPTION value="2">2
	<OPTION value="3">3
	<OPTION value="4">4
	<OPTION value="5">5
	<OPTION value="6">6
	<OPTION value="7">7
	<OPTION value="8">8
	<OPTION value="9">9
	<OPTION value="10" SELECTED>10
	</select>
	</form>
	</td>
</tr>
</table>


</td></tr></table>

</body>
</html>
