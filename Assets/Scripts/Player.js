#pragma strict

private var moveSpeed:float = 0.75;

private var beatsPerMinute:float = 40.0;
var beatTimer:float;
private var beatStrength:float = 1.25;

private var radiusThresholds:float[] = [
	1.0,
	5.0,
	15.0,
	20.0,
	30.0,
	45.0
];
private var radiusNames:String[] = [
	"player-position",
	"player-hitbox",
	"npc-aim",
	"npc-remain",
	"npc-healthy",
	"npc-alone",
	"npc-death"
];
private var radiusSpeeds:int[] = [
	0,
	1,
	1,
	4,
	4,
	2,
	0
];
var npcList:Array = new Array();
var bodyCount:int = 0;
private var endTimer:float = 0.0;
private var endDuration:float = 20.0;
private var cameraComponent:Camera;
private var cameraStart:int;
private var cameraEnd:int = 1000;

var animName:String;

function Start () {
	this.beatTimer = this.beatsPerMinute;
	this.setAnimation("Idle");
	this.cameraComponent = gameObject.GetComponentInChildren(Camera);
	this.cameraStart = this.cameraComponent.orthographicSize;
}

function Update () {
	var modSpeed:float;
	modSpeed = Input.GetButton("Jump")
		? 3.0
		: 1.0;
	if (Input.GetButton("Up")) {
		this.transform.position.z += modSpeed * moveSpeed * Time.deltaTime;
	}
	if (Input.GetButton("Down")) {
		this.transform.position.z -= modSpeed * moveSpeed * Time.deltaTime;
	}
	if (Input.GetButton("Left")) {
		this.transform.position.x -= modSpeed * moveSpeed * Time.deltaTime;
		//this.transform.Rotate(new Vector3(- turnSpeed * Time.deltaTime, 0, 0));
	}
	if (Input.GetButton("Right")) {
		this.transform.position.x += modSpeed * moveSpeed * Time.deltaTime;
		//this.transform.Rotate(new Vector3(  turnSpeed * Time.deltaTime, 0, 0));
	}
	if (Input.GetKey("escape")) {
		Application.LoadLevel(1);
		//Application.Quit();
	}
	this.rigidbody.velocity = Vector3(0, 0, 0);
	this.advanceBeat();
	if (Input.GetMouseButton(0)) {
		this.move();
		this.setAnimation("Walk");
	} else {
		this.setAnimation("Idle");
	}
	if (bodyCount > 0 && bodyCount == npcList.length) {
		this.gameOver();
	}
}
function move() {
	// Generate a plane that intersects the transform's position with an upwards normal.
	var playerPlane = new Plane(Vector3.up, this.transform.position);
	// Generate a ray from the cursor position
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	// Determine the point where the cursor ray intersects the plane.
	// This will be the point that the object must look towards to be looking at the mouse.
	// Raycasting to a Plane object only gives us a distance, so we'll have to take the distance,
	// then find the point along that ray that meets that distance. This will be the point
	// to look at.
	var hitdist:float = 0.0;
	// If the ray is parallel to the plane, Raycast will return false.
	if (playerPlane.Raycast (ray, hitdist)) {
		// Get the point along the ray that hits the calculated distance.
		var targetPoint = ray.GetPoint(hitdist);
		
		// Determine the target rotation. This is the rotation if the transform looks at the target point.
		var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
		
		// Smoothly rotate towards the target point.
		//transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, this.moveSpeed * Time.deltaTime);
		
		// Move the object forward.
		var move:Vector3 = (targetPoint - transform.position) * this.moveSpeed * Time.deltaTime;
		transform.position += move;
		if (move.x > 0.0) {
			this.transform.localScale.x = - Mathf.Abs(this.transform.localScale.x);
		}
		if (move.x < 0.0) {
			this.transform.localScale.x = Mathf.Abs(this.transform.localScale.x);
		}
	}
}
function setAnimation(newAnim:String) {
	if (this.animName != newAnim) {
		this.animName = newAnim;
		gameObject.SendMessage("ChangeAnimationTo", this.animName);
	}
}
function advanceBeat() {
	this.beatTimer += Time.deltaTime;
	if (this.beatTimer > 60.0 / this.beatsPerMinute) {
		this.sendBeat();
		this.beatTimer = 0.0;
	}
}
function sendBeat() {
	var npc:NPC;
	var i:int;
	for (i = 0; i < this.npcList.length; i++) {
		npc = this.npcList[i];
		npc.startBeat(this.beatStrength);
	}
	this.playBeat(this.beatStrength);
}
function getRadiusName(position:Vector3) {
	var distance:float = Vector3.Distance(this.transform.position, position);
	var i:int;
	for (i = 0; i < this.radiusThresholds.length; i++) {
		if (this.radiusThresholds[i] > distance) {
			break;
		}
	}
	return this.radiusNames[i];
}
function getRadiusSpeed(position:Vector3) {
	var distance:float = Vector3.Distance(this.transform.position, position);
	var i:int;
	for (i = 0; i < this.radiusThresholds.length; i++) {
		if (this.radiusThresholds[i] > distance) {
			break;
		}
	}
	return this.radiusSpeeds[i];
}
function addNPC(npc:NPC) {
	this.npcList.Add(npc);
}
function playBeat(strength:float) {
	var pulse:GameObject = gameObject.Find("Pulse");
	pulse.SendMessage("restart");
	this.audio.Play();
}

function gameOver() {
	this.endTimer += Time.deltaTime / this.endDuration;
	this.cameraComponent.orthographicSize = Mathf.Lerp(this.cameraStart, this.cameraEnd, this.endTimer);
	if (this.endTimer > 1.0) {
		Application.LoadLevel(1);
	}
}