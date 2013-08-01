#pragma strict

class Abyss extends MonoBehaviour {
	function Start() {}
	
	function Update() {}
	
	function OnTriggerEnter(other : Collider) {
		if (other.gameObject.tag == "Player") {
			Destroy(other.gameObject);
			Application.Quit();
		}
	}
}