// Properties
var correctingID;
var reviewXML; // xmlDoc of the loaded review
var ns = [];	// all question numbers, to be used as 'i' for example in question=questions[i]
var keys = [];	// All keys and their words and values
// Working variables
var mode = 0; // 0=loadReviewList, 1=loadReview, 2=question, 3=answer, repeat 2-3
var qType = "Short"; // Short=Short Answer, Multiple=Multiple Choice, List=List off answers
var n = -1; // Question/Answer number
var q = "Question appears here.";
var a = "Type your answer here.";

function main()
{

switch(mode)
{
case 0:
// init
document.getElementById("questionBox").innerHTML = "How to use:<br/>1) Click *Load Review*<br/>2) Click *Generate Question*.";
document.getElementById("answerBox").innerHTML = "3) Type in your answer in the Answer box below<br/>*Answer box here*<br/>4) Click *Show Answer* when you're done!<br/>Happy studying!";

loadReviewList();
document.getElementById("submitButton").value = "Load Review";

if (document.layers)
    document.captureEvents(Event.KEYDOWN);
document.onkeydown =
    function (evt) {
        var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
        if (keyCode == 13) { 
            //For enter.
            //Your function here.
            //main();				// PROBLEM: When typing and click Enter key, goes to next main()
        }
        if (keyCode == 27) { 
            //For escape.
            //Your function here.
            
        }
        else
            return true;
    };
    
	var selectmenu=document.getElementById("reviewSelect")
	selectmenu.onchange=function()
	{ //run some code when "onchange" event fires
	/*
		var chosenoption=this.options[this.selectedIndex] //this refers to "selectmenu"
		if (chosenoption.value!="nothing")
		{
			window.open(chosenoption.value, "", "") //open target site (based on option's value attr) in new window
		}
	*/
		document.getElementById("submitButton").value = "Load Review";
		mode=1;
	}
	
    mode=1; // Next mode
    break;

case 1:

loadReview();
document.getElementById("submitButton").value = "Generate Question";

mode = 2; // Next mode
break;
case 2:
// question
genQ();
document.getElementById("submitButton").value = "Show Answer";

mode = 3; // Next mode
break;
case 3:
// answer
showA();
document.getElementById("submitButton").value = "Generate Question";

mode = 2; // repeat
break;
}

}

function loadReviewList()
{

// Add options from an object/list
	var reviewsList = [];
	/*{
    ValueA : 'globalGeo12.xml',
    ValueB : 'Text B',
    ValueC : 'Text C'
	};*/

	if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  
xmlhttp.open("GET","reviewList.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML; 

var x=xmlDoc.getElementsByTagName("REVIEW");
for (i=0;i<x.length;i++)
  { 
  
  /*
  <REVIEW>
	<NAME>Global Geography 12</NAME>
	<LINK>globalGeo12.xml</LINK>
</REVIEW>
*/
  
  var name = x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
  var link = x[i].getElementsByTagName("LINK")[0].childNodes[0].nodeValue;
	reviewsList.push([name,"reviews/"+link]);
  }


	// Clear
	/*
	var select = document.getElementById("example-select");
	select.options.length = 0;
	*/

	// Add hard-coded values
	/*
	var select = document.getElementById("example-select");
	select.options[select.options.length] = new Option('Text 1', 'Value1');
	*/
	
	/*
	var selectObj = document.getElementById("reviewSelect");
	var selectParentNode = selectObj.parentNode;
	var newSelectObj = selectObj.cloneNode(false); // Make a shallow copy
	selectParentNode.replaceChild(newSelectObj, selectObj);
	return newSelectObj;
	*/
	var select = document.getElementById("reviewSelect"); 
	select.innerHTML = ""; // Clear select
	for(index in reviewsList) {
		select.options[select.options.length] = new Option(reviewsList[index][0], reviewsList[index][1]);
	}
	
	/*
	var select = document.getElementById("example-select");
	if(select.options.length > 0) {
		window.alert("Text: " + select.options[select.selectedIndex].text + "\nValue: " + select.options[select.selectedIndex].value);
	}
	else {
		window.alert("Select box is empty");
	}
	*/

	
}

function loadReview()
{

try
{

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  var reviewLink = getReview();
  
xmlhttp.open("GET",reviewLink,false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML; 

window.reviewXML=xmlDoc; // stored in global variable for loading later

var questions=xmlDoc.getElementsByTagName("QUESTION");
for (i=0;i<questions.length;i++)
  { 
  /*
  // Example
  <QUESTION>
	<!-- Question 1 -->
	<ID>1</ID>
	<Q>What is the International Poverty Line?</Q>
	<TYPE>Short</TYPE> <!-- Short = Short answer -->
	<ANSWER>
		<FULL>
		The international poverty line has in the past been roughly $1.00 a day. In 2008 the world bank came out with a revised figure of $1.25
		</FULL>
		<KEY>
			<WORD>1.00</WORD>
			<WORD>$1.00</WORD>
			<VALUE>0.5</VALUE>
		</KEY>
		<KEY>
			<WORD>1.25</WORD>
			<WORD>$1.25</WORD>
			<VALUE>0.5</VALUE>
		</KEY>	
	</ANSWER>
</QUESTION>
  */
  
  //var Q = questions[i].getElementsByTagName("Q")[0].childNodes[0].nodeValue;
  //var A = questions[i].getElementsByTagName("ANSWER")[0].getElementsByTagName("FULL")[0].childNodes[0].nodeValue;
  //var N = questions[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
  ns.push(i);
 
  
  /*
  // KEYS TEST
  try
  {
  questions = x;
  var a0 = x[i].getElementsByTagName("ANSWER")[0];
  logC("a0:"+a0+"<br/>"+a0.length);
  var keysA = a0.getElementsByTagName("KEY");
  logC("keysA:"+keysA+"<br/>"+keysA.length);
  var k0 = keysA[0];
  logC("k0:"+k0+"<br/>"+k0.length);
  var wordsA = k0.getElementsByTagName("WORD");
  logC("wordsA:"+wordsA+"<br/>"+wordsA.length);
  var w0 = wordsA[0];
  logC("w0:"+w0+"<br/>"+w0.length);
  var v0 = parseFloat(k0.getElementsByTagName("VALUE")[0].childNodes[0].nodeValue);
  logC("v0:"+v0+"<br/>"+v0.length);
  } catch (err) { logC("Error: "+err); }
  */
  
  }

/*
 * Add a shuffle function to Array object prototype
 * Usage : 
 *  var tmpArray = ["a", "b", "c", "d", "e"];
 *  tmpArray.shuffle();
 * Source: http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
 Array.prototype.shuffle = function (){
    var i = this.length, j, temp;
    if ( i == 0 ) return;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
};
 */
 
 
    var i = ns.length, j, tempN;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        tempN = ns[i];
        ns[i] = ns[j];
        ns[j] = tempN;
        if ( i == 0 ) break;
    }

	// Successfully loaded review
	
	var select = document.getElementById("reviewSelect");
	var reviewName = select.options[select.selectedIndex].text;
	document.getElementById("questionBox").innerHTML = "Review "+reviewName+" is loaded successfully.<br/>Click *Generate Question*.";
	
} catch (err) {logC("Error: "+err);}

}


function genQ()
{

/*
do
{
nn = Math.floor((Math.random()*(qs.length))+0); 
} while (n==nn);
n=nn;
*/
// Already shuffled when loadActivity()
n++;
if (n>=ns.length) 
{
	n=0; 
	document.getElementById("answerBox").innerHTML = "DONE!";
}
else
{

	if (qType=="Short")
	{
		document.getElementById("answerBox").innerHTML = '<textarea rows="10" cols="10" id="answerInput" >'+""+'</textarea>';
	}
	else
	{
		// implement other question types
	}

}


window.q = getQuestion(parseInt(ns[n]));
window.a = getAnswerFull(parseInt(ns[n]));

// Show question
document.getElementById("questionBox").innerHTML = "Question:<br/>"+window.q;
//document.getElementById("answer").innerHTML = "";

// document.getElementById("submitButton").innerHTML = '<input id="submit" type="button" onclick="showA()" value="Show Answer">'; // Answer

}

function showA()
{
// 'a' is the answer
correctAnswer();
var userAnswer = document.getElementById("answerInput").value;
document.getElementById("answerBox").innerHTML = '<textarea rows="10" cols="10" id="answerInput" >'+("Your answer:\n"+userAnswer+"\n\nCorrect Answer:\n"+window.a)+'</textarea>';

// document.getElementById("submitButton").innerHTML = '<input id="submit" type="button" onclick="genQ()" value="New Question">'; // Question

}



function getReview()
{
	var select = document.getElementById("reviewSelect");
	var review = select.options[select.selectedIndex].value;
	return review;
}

function getQuestion(n)
{
	var Q = window.reviewXML.getElementsByTagName("QUESTION")[n].getElementsByTagName("Q")[0].childNodes[0].nodeValue;
	return Q;
}
function getAnswerFull(n)
{
	var A = window.reviewXML.getElementsByTagName("QUESTION")[n].getElementsByTagName("ANSWER")[0].getElementsByTagName("FULL")[0].childNodes[0].nodeValue;
	return A;
}


function getWidth()
  {
          var x = 0;
          if (self.innerHeight)
          {
                  x = self.innerWidth;
          }
          else if (document.documentElement && document.documentElement.clientHeight)
          {
                  x = document.documentElement.clientWidth;
          }
          else if (document.body)
          {
                  x = document.body.clientWidth;
          }
          return x;
  }

  function getHeight()
  {
          var y = 0;
          if (self.innerHeight)
          {
                  y = self.innerHeight;
          }
          else if (document.documentElement && document.documentElement.clientHeight)
          {
                  y = document.documentElement.clientHeight;
          }
          else if (document.body)
          {
                  y = document.body.clientHeight;
          }
          return y;
  }

function supportsStorage()
{
if(typeof(Storage)!=="undefined")
  {
  // Yes! localStorage and sessionStorage support!
  return true;
  }
else
  {
  // Sorry! No web storage support..
  	return false;
  }
}


// ----------------------------------------- Correcting ---------------------------------
function autoCorrection(cb) {
  setTimeout(function() {
    var checked = cb.checked;
    if (checked == true)
    { // Clicked, on
       // document.getElementById("questionBox").innerHTML = checked;
    	 window.correctingID = setInterval("correctAnswer()",500);

    }
    else
    { // Unclicked, off
        //document.getElementById("questionBox").innerHTML = checked;
    	clearInterval(window.correctingID);	
    }
    
  }, 0);
}

function correctAnswer()
{
if (mode==3)
{

try
{
	// document.getElementById("questionBox").innerHTML = document.getElementById("questionBox").innerHTML + ".";
	var questions = window.reviewXML.getElementsByTagName("QUESTION");
	//var Q = questions[i].getElementsByTagName("Q")[0].childNodes[0].nodeValue;
   // var A = questions[i].getElementsByTagName("ANSWER")[0].getElementsByTagName("FULL")[0].childNodes[0].nodeValue;
    //var N = questions[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
    var num=parseInt(ns[window.n]);
var keys = questions[num].getElementsByTagName("ANSWER")[0].getElementsByTagName("KEY");
} catch (err) 
		{ logC("Error: "+err); }
 
  /*
  // KEYS TEST
  try
  {
  questions = x;
  var a0 = x[i].getElementsByTagName("ANSWER")[0];
  logC("a0:"+a0+"<br/>"+a0.length);
  var keysA = a0.getElementsByTagName("KEY");
  logC("keysA:"+keysA+"<br/>"+keysA.length);
  var k0 = keysA[0];
  logC("k0:"+k0+"<br/>"+k0.length);
  var wordsA = k0.getElementsByTagName("WORD");
  logC("wordsA:"+wordsA+"<br/>"+wordsA.length);
  var w0 = wordsA[0];
  logC("w0:"+w0+"<br/>"+w0.length);
  var v0 = parseFloat(k0.getElementsByTagName("VALUE")[0].childNodes[0].nodeValue);
  logC("v0:"+v0+"<br/>"+v0.length);
  } catch (err) { logC("Error: "+err); }
  */
  
	
	var answerInput = document.getElementById("answerInput");
	var caretPos = doGetCaretPosition(answerInput);
	
	//logC("keys.length:"+keys.length);
	var score = 0; // 0=0%, 1=100%
	
	try
	{
		
	for (var k = 0; k<keys.length;k++)
	{
		  
		//var a0 = x[i].getElementsByTagName("ANSWER")[0];
		//var kA = a0.getElementsByTagName("KEY");
		var key = keys[k];
		var words = key.getElementsByTagName("WORD");
		var val = parseFloat(key.getElementsByTagName("VALUE")[0].childNodes[0].nodeValue);
							
		var hasWord = false;
		try
		{
			for (var w = 0; w<words.length; w++)
			{
				var word = String(words[w].childNodes[0].nodeValue).toLowerCase();
				//logC("word["+w+"]:"+word);
				var count = occurrences(String(""+answerInput.value+"").toLowerCase(),String(""+word+""));
				//logC("occurs:"+count);
				if (count > 0)
				{
					hasWord = true;
					//logC("hasWord:"+hasWord);
				}
				
				
			}
		}
		catch (err) 
		{ logC("Error: "+err); }
					
		//logC("score:"+score);
		//logC("val:"+val);
		//logC("hasWord:"+hasWord);
		if (hasWord == true)
		{
			score = score + val;
			//logC("score:"+score);
		}
		//logC("new score:"+score);
		
	}
	
	} catch (err) 
		{ logC("Error: "+err); }
	
	
	/*
			var input = answerInput.value;
			var initWord = "*Glavin*";
			var finalWord = "*Glavin is Awesome*";
			var count = (occurrences(input,initWord));
			while (occurrences(input,initWord) > 0)
			{
				//input = input.replace(new RegExp(initWord, 'g'), finalWord);
				input = input.replace(initWord,finalWord);
			}
			var delta = count*(finalWord.length-initWord.length);
			document.getElementById("answerInput").value = input;//input;
			var caretPos = (caretPos+delta);
			
	 setCaretPosition(answerInput,caretPos);
	*/
	var corrections = ("You're score is " + (score*100) + "%.");
	document.getElementById("questionBox").innerHTML = "Question:<br/>"+window.q + "<br/><br/>" + corrections;//input;

	
	}
	
}

function occurrences(string, substring){

    var n=0;
    var pos=0;

    while(true){
        pos=string.indexOf(substring,pos);
        if(pos!=-1){ n++; pos+=substring.length;}
        else{break;}
    }
    return(n);
}

function doGetCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}
function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}




// ----------------------------- Console
function logC(msg)
{
	document.getElementById("console").innerHTML = document.getElementById("console").innerHTML + "<br/>"+ msg;
}