using UnityEngine;
using System.Collections;

public class Ani_Manager : MonoBehaviour {
	
	
	float timer;				//timeCounter
	public float frameDelay = 0.0416f;	//time for each Frame
	int CurrentFrame = 0;			//Current Array ID
	int Age = 0;
	
	//Animations		Animation Arrays
	public Texture[] InActive;
	
	public Texture[] Idle_Young;
	public Texture[] Walk_Young;
	public Texture[] Suffer_Young;
	public Texture[] Die_Young_Live_Fast;
	public Texture[] Dead_Young;
	
	public Texture[] Idle_MidLife;
	public Texture[] Walk_MidLife;
	public Texture[] Suffer_MidLife;
	public Texture[] Dying_MidLife;
	public Texture[] Dead_MidLife;
	
	public Texture[] Idle_Old;
	public Texture[] Walk_Old;
	public Texture[] Suffer_Old;
	public Texture[] Dying_Old;
	public Texture[] Dead_Old;
	
	//Animation Array Packages
	Texture[][] Idle = new Texture[3][];
	Texture[][] Walk = new Texture[3][];
	Texture[][] Suffer = new Texture[3][];
	Texture[][] Dying = new Texture [3][];
	Texture[][] Dead = new Texture [3][];
	
	Texture[] CurrentAnimation; //Array with the Current Animation_Array which is to be played
	
	// Use this for initialization
	void Start () {
	
		Idle[0] = Idle_Young;
		Idle[1] = Idle_MidLife;
		Idle[2] = Idle_Old;
		
		Walk[0] = Walk_Young;
		Walk[1] = Walk_MidLife;
		Walk[2] = Walk_Old;
		
		Suffer[0] = Suffer_Young;
		Suffer[1] = Suffer_MidLife;
		Suffer[2] = Suffer_Old;
		
		Dying[0] = Die_Young_Live_Fast;
		Dying[1] = Dying_MidLife;
		Dying[2] = Dying_Old;
		
		Dead[0] = Dead_Young;
		Dead[1] = Dead_MidLife;
		Dead[2] = Dead_Old;
		ChangeAnimationTo("Idle");	
	}
	
	// Update is called once per frame
	void Update () {
	
		if(timer == 0)	animateMe();
		
		timer += Time.deltaTime;
		if(timer >= frameDelay)timer = 0;
	}
	
	//Plays Me the
	void animateMe(){
			
		if(CurrentFrame >= CurrentAnimation.Length){
			CurrentFrame = 0;
			if( CurrentAnimation == Dying[Age] )ChangeAnimationTo("Dead");
		}
		if (CurrentAnimation.Length > CurrentFrame) {
			gameObject.renderer.material.mainTexture = CurrentAnimation[CurrentFrame];
			
		}
		
		CurrentFrame ++;
	}//AnimateMe
	
	public void changeAgeTo(int age){
		Age = age;
	}
	
	void ChangeAnimationTo(string state){  //states: InActive/Idle/Walk/Suffer/Dying/Dead - Age: Young/Midlife/Old
		
		CurrentFrame = 0;
		//if(CurrentAnimation == Dead[Age])return;
		switch(state){
			
			case "InActive":
			CurrentAnimation = InActive;
			break;
			
			case "Idle":
			CurrentAnimation = Idle[Age];
			break;
			
			case "Walk":
			CurrentAnimation = Walk[Age];
			break;
			
			case "Suffer":
			CurrentAnimation = Suffer[Age];
			Debug.Log(CurrentAnimation[0]);
			break;
			
			case "Dying":
			CurrentAnimation = Dying[Age];
			break;
			
			case "Dead":
			CurrentAnimation = Dead[Age];
			break;
			
			default:
			CurrentAnimation = InActive;
			break;
		}
	
		//Debug.Log("Somebody Called Me?");
	}
}
