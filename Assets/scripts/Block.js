#pragma strict

class Block extends MonoBehaviour {
	function Start() {}
	
	function Update() {}
	
	function OnTriggerEnter(other : Collider) {
		if(other.gameObject.tag == "Player"){
			this.hitBottom();
		}
	}
	
	function hitTop() {}
	
	function hitBottom() {}
}
