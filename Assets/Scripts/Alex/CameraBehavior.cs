using UnityEngine;
using System.Collections;
//using Interpolator;
public class CameraBehavior : MonoBehaviour {
	
	//public Texture2D[] cursorAni;
	public Texture2D cursorImage;
	Rect mouseRect = new Rect(0,0,0,0);
	//int aniCounter;
	//float timer;
	//float delay = 0.1f;
	
	// Use this for initialization
	void Start () {
		Screen.showCursor = false;		
	}
	
	// Update is called once per frame
	void Update () {
		
		GetMouseInfo();
		}
		

	void GetMouseInfo(){
		/*
		if(timer == 0){
			cursorImage = cursorAni[aniCounter];
			aniCounter ++;
			if(aniCounter == cursorAni.Length) aniCounter = 0;
		}
		timer += Time.deltaTime;
		if(timer >= delay)timer = 0;
		//cursorImage = cursorAni[0];*/
		Vector2 mousePos = Input.mousePosition;
		mouseRect  = new Rect(mousePos.x - cursorImage.width/32, Screen.height - mousePos.y - cursorImage.width/32, cursorImage.width/16, cursorImage.height/16);
	}
		
	void OnGUI(){
		GUI.Label(mouseRect,cursorImage); 
	}
}
