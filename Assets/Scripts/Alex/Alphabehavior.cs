using UnityEngine;
using System.Collections;

public class Alphabehavior : MonoBehaviour {
	
	
	bool afterGlowOn;
	float afterGlowCD;
	float CoolDownMax = 1.6f;
	float afterGlowTime;
	
	float alphaCharge = 0;
	// Use this for initialization
	void Start () {
	
		//colliderRadius = collider.radius;
	}
	
	// Update is called once per frame
	void Update () {
	
		if(afterGlowOn){
		
			if(afterGlowCD > 0 ){
				afterGlowCD -= Time.deltaTime;
				//if(alphaCharge > 0.8f) alphaCharge -= Time.deltaTime;
				return;
			}
			else{
				alphaCharge -= Time.deltaTime * 0.5f;
				if(alphaCharge < 0) alphaCharge = 0;
				if(alphaCharge == 0) afterGlowOn = false;
			}
		}
		
		gameObject.renderer.material.color = new Vector4(gameObject.renderer.material.color.r,gameObject.renderer.material.color.g, gameObject.renderer.material.color.b, alphaCharge);
	}
	
	void OnTriggerStay(Collider other){
	
		if(other.gameObject.tag != "Npc") return;
		
		if(alphaCharge == 0) alphaCharge += 0.1f;
		alphaCharge += Time.deltaTime;
		if( alphaCharge > 1) alphaCharge = 1;
		
		if(afterGlowOn) afterGlowOn = false;
	}
	
	void OnTriggerExit(Collider other){
	
		afterGlowOn = true;
		afterGlowCD = CoolDownMax;
	}
}
