using UnityEngine;
using System.Collections;

public class playMeThis : MonoBehaviour {
	
	public Texture[] playThis;
	float timer;
	public float frameDelay;
	int CurrentFrame = 0;

	// Update is called once per frame
	void Update () {
		if (CurrentFrame >= playThis.Length) return;
		if(timer == 0){
			gameObject.renderer.material.mainTexture = playThis[CurrentFrame];
			CurrentFrame ++;
			gameObject.renderer.enabled = CurrentFrame < playThis.Length;
		}
	
		timer += Time.deltaTime;
		if(timer >= frameDelay)timer = 0;
	}
	public void restart() {
		CurrentFrame = 0;
	}
}
