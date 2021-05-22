#pragma strict
private var radiusSpeed:int;
var moveDirection:Vector3 = new Vector3(0, 0, 0);
var moveTarget:Vector3;
var moveWait:float;
var movePattern:int = 0;
var movePatternVar:int;

var age:float = 0.0;
var ageCategory:int = 0;
var ageThresholds:float[] = [
	15.0,
	40.0,
	60.0
];
var ageSpeeds:int[] = [
	8,
	5,
	3,
	0
];
var ageSizes:float[] = [
	1.0,
	1.2,
	1.5,
	1.5
];
var healthStatus:String;
private var healthStati:String[] = [
	"Asleep",
	"Awake",
	"Suffer",
	"Dying",
	"Dead"
];
var healthCountdown:int;
private var healthMax:int = 3;			//number of missed beats until death
private var healthMin:float = 1.0;		//minimum beat strength that counts as not-missed beat
private var dyingDuration:float = 2;	//time it takes to die

var animName:String;

var beatList:Array;
private var beatMove:float = 30.0;		//movement of beat towards NPC per second
private var beatDecrease:float = 0.5;	//decrease of beat strength per second
var ownerPlayer:GameObject;
var ownerPlayerScript:Player;
var playerRadius:String;
var heartlineRenderer:LineRenderer;

var audioFiles:AudioClip[];
var lightList:Component[];

function Start () {
	//this.heartlineRenderer = gameObject.AddComponent(LineRenderer);
	//this.heartlineRenderer.material = new Material (Shader.Find("Particles/Additive"));
	//this.heartlineRenderer.SetColors(Color.white, Color.black);
	//this.heartlineRenderer.SetWidth(1.0, 1.0);
	this.lightList = GetComponentsInChildren(Light);
	this.heartlineRenderer = GetComponent(LineRenderer);
	this.heartlineRenderer.material = new Material (Shader.Find("Particles/Additive"));
	//this.heartlineRenderer.SetColors(Color.white, Color.black);
	this.healthStatus = "Asleep";
	this.beatList = new Array();
	this.ownerPlayer = GameObject.Find("Player");
	this.ownerPlayerScript = this.ownerPlayer.GetComponent(Player);
	this.calcRadius();
	this.advanceAge();
	this.setAnimation("Idle");
	
	this.ownerPlayerScript.addNPC(this);
}

function Update () {
	this.calcRadius();
	//this.calcLighting();
	this.advanceAge();
	this.rigidbody.velocity = Vector3(0, 0, 0);
	this.move();
	this.heartlineRenderer.SetVertexCount(0);
	switch (this.healthStatus) {
		case "Asleep":
			break;
		case "Awake":
		case "Suffer":
			this.drawHeartline();
			break;
		case "Dying":
			this.drawFlatline();
			break;
		case "Dead":
			break;
	}
	//var playerRadius:String = this.ownerPlayerScript.getRadiusName(this.transform.position);
}
function calcRadius() {
	this.playerRadius = this.ownerPlayerScript.getRadiusName(this.transform.position);
	switch (this.healthStatus) {
		case "Asleep":
			this.radiusSpeed = 0;
			switch (this.playerRadius) {
				case "player-position":
				case "player-hitbox":
				case "npc-aim":
				case "npc-remain":
					this.awake();
					break;
				case "npc-healthy":
				case "npc-alone":
					break;
			}
			break;
		case "Awake":
			this.radiusSpeed = this.ownerPlayerScript.getRadiusSpeed(this.transform.position);
			this.moveTarget = this.ownerPlayer.transform.position - this.transform.position;
			switch (this.playerRadius) {
				case "player-position":
				case "player-hitbox":
					this.moveTarget = new Vector3(0, 0, 0);
					this.radiusSpeed = 0;
					break;
				case "npc-aim":
					this.moveTarget = new Vector3(0, 0, 0);
					break;
				case "npc-remain":
				case "npc-healthy":
				case "npc-alone":
				case "npc-death":
					break;
			}
			/*
			this.healthCountdown -= this.healthDecrease * Time.deltaTime;
			if (this.healthCountdown < 1.0) {
				this.die();
			}
			//*/
			break;
		case "Suffer":
			this.radiusSpeed = 0;
			switch (this.playerRadius) {
				case "player-position":
				case "player-hitbox":
				case "npc-aim":
				case "npc-remain":
					this.revive();
					break;
				case "npc-healthy":
				case "npc-alone":
					break;
			}
			break;
		case "Dying":
			this.radiusSpeed = 0;
			this.dyingDuration -= Time.deltaTime;
			if (this.dyingDuration < 0.0) {
				this.dead();
			}
			break;
		case "Dead":
			this.radiusSpeed = 0;
			this.audio.volume -= 0.1 / this.audio.volume * Time.deltaTime;
			break;
	}
}
function calcLighting() {
	var intensity:float;
	var angle:float;
	switch (this.healthStatus) {
		case "Asleep":
			intensity = 1.0;
			angle = 60.0;
			break;
		case "Awake":
			intensity = 3.0;
			angle = 120.0;
			break;
		case "Suffer":
			intensity = 2.0;
			angle = 90.0;
			break;
		case "Dying":
			intensity = 1.5;
			angle = 60.0;
			break;
		case "Dead":
			intensity = 0.5;
			angle = 30.0;
			break;
	}
	for (var light : Light in lightList) {
		//light.intensity = intensity;
		light.range = angle;
	}
}
function move() {
	var move:Vector3;
	var pause:int = 1;
	if (this.moveTarget.magnitude > 0) {
		//this.moveDirection += this.moveTarget;
		//this.moveDirection += Vector3.Cross(this.moveDirection, Vector3.up).normalized * Random.Range(-100.0, 100.0);
		//this.moveDirection += Vector3.RotateTowards this.moveDirection * Random.Range(-10.0, 10.0);
	} else {
		this.moveWait += Time.deltaTime;
		if (this.moveWait > 3.0) {
			this.moveWait = Random.Range(-2.0, 0.0);
		}
		if (this.moveWait < this.ageCategory) {
			pause = 0;
		}
	}
	this.moveDirection.x += Random.Range(-0.5, 0.5);
	this.moveDirection.z += Random.Range(-0.5, 0.5);
	this.moveDirection = this.moveDirection.normalized;
	
	switch (this.movePattern) {
		case 0:
			this.moveDirection = Vector3.RotateTowards(this.moveDirection, this.moveDirection + new Vector3(Random.Range(-10, 10), 0, Random.Range(-10, 10)),  25.0 * Mathf.Deg2Rad * Time.deltaTime, 1);
			break;
		case 1:
			if (this.movePatternVar > 0) {
				this.moveDirection = Vector3.RotateTowards(this.moveDirection, this.moveDirection + new Vector3(100, 0, 100),  25.0 * Mathf.Deg2Rad * Time.deltaTime, 1);
			} else {
				this.moveDirection = Vector3.RotateTowards(this.moveDirection, this.moveDirection - new Vector3(100, 0, 100), -25.0 * Mathf.Deg2Rad * Time.deltaTime, 1);
			}
			break;
	}
	move = (this.moveDirection + this.moveTarget).normalized;
	move *= pause * this.ageSpeeds[this.ageCategory] * this.radiusSpeed * Time.deltaTime;
	
	
	if (move.magnitude > 0.0) {
		this.transform.position += move;
		if (move.x > 0.0) {
			this.transform.localScale.x = - Mathf.Abs(this.transform.localScale.x);
		}
		if (move.x < 0.0) {
			this.transform.localScale.x = Mathf.Abs(this.transform.localScale.x);
		}
		this.setAnimation("Walk");
	} else {
		if (this.animName == "Walk") {
			this.setAnimation("Idle");
		}
	}
}
function awake() {
	this.healthCountdown = this.healthMax;
	this.healthStatus = "Awake";
	this.setAnimation("Idle");
	this.tag = "Npc";
	this.startBeat(3.0);
}
function suffer() {
	this.playBeep();
	this.healthStatus = "Suffer";
	this.setAnimation("Suffer");
}
function revive() {
	this.healthCountdown = this.healthMax;
	this.healthStatus = "Awake";
	this.setAnimation("Idle");
}
function die() {
	this.playFatline();
	this.healthStatus = "Dying";
	this.setAnimation("Dying");
}
function dead() {
	this.healthStatus = "Dead";
	this.animName = "Dead";
	this.rigidbody.constraints = RigidbodyConstraints.FreezeAll;
	this.ownerPlayerScript.bodyCount++;
}

function advanceAge() {
	if (this.healthStatus != "Awake") {
		return;
	}
	this.age += Time.deltaTime;
	var i:int;
	for (i = 0; i < this.ageThresholds.length; i++) {
		if (this.ageThresholds[i] > this.age) {
			break;
		}
	}
	this.setAgeCategory(i);
}
function setAgeCategory(cat:int) {
	this.transform.localScale.x = this.ageSizes[this.ageCategory];
	this.transform.localScale.z = this.ageSizes[this.ageCategory];
	if (this.ageCategory != cat) {
		this.ageCategory = cat;
		gameObject.SendMessage("changeAgeTo", Mathf.Min(this.ageCategory, 2));
		gameObject.SendMessage("ChangeAnimationTo", this.animName);
	}
}
function setAnimation(newAnim:String) {
	if (this.animName != newAnim) {
		this.animName = newAnim;
		gameObject.SendMessage("ChangeAnimationTo", this.animName);
	}
}
function startBeat(strength:float) {
	switch (this.movePattern) {
		case 1:
			if (this.movePatternVar > 0) {
				this.movePatternVar = 0;
			} else {
				this.movePatternVar = 1;
			}
			break;
	}
	switch (this.healthStatus) {
		case "Asleep":
			break;
		case "Awake":
		case "Suffer":
			//this.beatList.Add(new Vector2(0.0, strength));
			var startPos:Vector3 = this.ownerPlayer.transform.position + new Vector3(0, -0.5, 0);
			var endPos:Vector3 = this.transform.position + new Vector3(0, 0.5, 0);
			this.beatList.Add(new Vector2(Vector3.Distance(startPos, endPos), strength));
			break;
		case "Dying":
		case "Dead":
			break;
	}
}
function drawHeartline() {
	var startPos:Vector3 = this.ownerPlayer.transform.position + new Vector3(0, -0.5, 0);
	var endPos:Vector3 = this.transform.position + new Vector3(0, 0.5, 0);
	var vertexCount:int = 2 + this.beatList.length * 4;
	var dist:float = Vector3.Distance(startPos, endPos);
	var i:int;
	var beatOrtho:Vector3;
	var beatVector:Vector2;
	var beatRemove:int;
	
	this.heartlineRenderer.SetVertexCount(vertexCount);
	for (i = 0; i < vertexCount; i++) {
		this.heartlineRenderer.SetPosition(i, new Vector3(0, 0, 0));
	}
	this.heartlineRenderer.SetPosition(0, startPos);
	endPos = Vector3.MoveTowards(endPos, startPos, 2.0);
	for (i = 0; i < this.beatList.length; i++) {
		beatVector = this.beatList[i];
		beatOrtho = Vector3.Cross(endPos-startPos, Vector3.up).normalized;

		this.heartlineRenderer.SetPosition(i * 4 + 1, Vector3.MoveTowards(startPos, endPos, Mathf.Max(0.0, dist - beatVector.x) + beatVector.y * 0.0));
		this.heartlineRenderer.SetPosition(i * 4 + 2, Vector3.MoveTowards(startPos, endPos, Mathf.Max(0.0, dist - beatVector.x) + beatVector.y * 0.1) + beatOrtho *  2 * beatVector.y);
		this.heartlineRenderer.SetPosition(i * 4 + 3, Vector3.MoveTowards(startPos, endPos, Mathf.Max(0.0, dist - beatVector.x) + beatVector.y * 0.2) + beatOrtho * -1 * beatVector.y);
		this.heartlineRenderer.SetPosition(i * 4 + 4, Vector3.MoveTowards(startPos, endPos, Mathf.Max(0.0, dist - beatVector.x) + beatVector.y * 0.3));
		
		beatVector.x -= this.beatMove * Time.deltaTime;
		beatVector.y -= beatVector.y * this.beatDecrease * Time.deltaTime;
		if (beatVector.x < 0.0) {
			beatRemove++;
			this.receiveBeat(beatVector.y);
		}
		this.beatList[i] = beatVector;
	}
	for (i = 0; i < beatRemove; i++) {
		this.beatList.Shift();
	}
	this.heartlineRenderer.SetPosition(vertexCount - 1, endPos);
}
function drawFlatline() {
	var startPos:Vector3 = this.ownerPlayer.transform.position + new Vector3(0, -0.5, 0);
	var endPos:Vector3 = this.transform.position + new Vector3(0, 0.5, 0);
	this.heartlineRenderer.SetColors(Color.red, Color.red);
	this.heartlineRenderer.SetVertexCount(2);
	this.heartlineRenderer.SetPosition(0, startPos);
	this.heartlineRenderer.SetPosition(1, endPos);
	
}
function receiveBeat(strength:float) {
	//this.healthCountdown = Mathf.Min(this.healthCountdown + strength, this.healthMax);
	//if (strength < this.healthMin) {
	switch (this.playerRadius) {
		case "npc-alone":
			this.healthCountdown--;
			if (this.healthCountdown > 0) {
				this.suffer();
			} else {
				this.die();
			}
			break;
		case "npc-death":
			this.die();
			break;
		default:
			if (this.healthStatus == "Suffer") {
				this.revive();
			}
			this.playBeat(strength);
			break;
	}
}
function playBeat(strength:float) {
	this.audio.clip = this.audioFiles[0];
	this.audio.volume = 1.0;//strength / 20.0;
	this.audio.Play();
}
function playBeep() {
	this.audio.clip = this.audioFiles[1];
	this.audio.volume = 0.05;
	this.audio.Play();
}
function playFatline() {
	this.audio.clip = this.audioFiles[2];
	this.audio.volume = 0.05;
	this.audio.Play();
}