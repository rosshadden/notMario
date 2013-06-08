#pragma strict

var player : GameObject;

function Start () {
	player = GameObject.FindGameObjectWithTag("Player");
}

function Update () {
	var position = player.transform.position;
	transform.position = new Vector3(position.x, position.y + 2, -10);
}