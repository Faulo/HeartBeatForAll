#pragma strict

var textComponent:GUIText;

private var textPages:String[] = [
	"Gᴀᴍᴇ Oᴠᴇʀ",
	"Credits:",
	"Producer:\nAlexander Röhrscheid",
	"Programmer:\nDaniel Schulz",
	"Artsy-Creepy Stuff:\nDaniel van Westen",
	"Awesome Stuff:\nClaudia Osthof",
	"Animator of the Sky:\nDenise Sostre",
	"Thanks for playing!"
];


var currentPage:int;
var fadeTimer:float;
private var timerSteps:float[] = [
	0.5,
	1.5,
	3.0,
	4.0,
	5.0
];


function Start () {
	textComponent = gameObject.GetComponent(GUIText);
	textComponent.material.color.a = 0.0;
	fadeTimer = 0.0;
	currentPage = 0;
	loadPage(currentPage);
}

function Update () {
	var i:int;
	for (i = 0; i < timerSteps.length; i++) {
		if (fadeTimer < timerSteps[i]) {
			loadStep(i);
			break;
		}
	}
	fadeTimer += Time.deltaTime;
}
function loadStep(stepNo:int) {
	switch (stepNo) {
		case 0:	//wait
			break;
		case 1:	//fadein
			textComponent.material.color.a = 1.0 + fadeTimer - timerSteps[stepNo];
			break;
		case 2:	//show
			break;
		case 3:	//fadeout
			textComponent.material.color.a = timerSteps[stepNo] - fadeTimer;
			break;
		case 4:	//restart
			currentPage++;
			loadPage(currentPage);
			fadeTimer = 0.0;
			break;
	}
}
function loadPage(pageNo:int) {
	if (pageNo < textPages.Length) {
		textComponent.text = textPages[pageNo];
	}
	if (pageNo == textPages.Length) {
		textComponent.text = "";
	}
	if (pageNo > textPages.Length) {
		Application.Quit();
	}
}