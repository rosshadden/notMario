#pragma strict

class BlockBreakable extends Block {
	function Start() {
		super();
	}
	
	function Update() {}
	
	function hitBottom() {
		Debug.Log("Good bye.");
		Destroy(this.gameObject);
	}
}