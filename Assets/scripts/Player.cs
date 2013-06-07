using UnityEngine;
using System.Collections;

public class Player : MonoBehaviour {
	CharacterController cc;
	CollisionFlags cf;
	
	public float speed = 10f;
	public float jumpSpeed = 9f;
	public float gravity = 21f;
	public float terminalVelocity = 20f;
	
	public Vector3 moveVector;
	public float verticalVelocity;

	// Use this for initialization
	void Start() {
		cc = GetComponent<CharacterController>();
	}
	
	// Update is called once per frame
	void Update() {
		checkMovement();
		handleActionInput();
		processMovement();
	}
	
	void checkMovement(){
		//	Move left/right.
		var deadZone = 0.1f;
		verticalVelocity = moveVector.y;
		
		if(isCeiled()){
			verticalVelocity = 0;
		}
		
		moveVector = Vector3.zero;
		
		if(Input.GetAxis("Horizontal") > deadZone || Input.GetAxis("Horizontal") < -deadZone){
			moveVector += new Vector3(Input.GetAxis("Horizontal"), 0, 0);
		}
	}
	
	void handleActionInput(){
		if(Input.GetButton("Jump")){
			jump();
		}
	}
	
	void processMovement(){
		//	Transform moveVector into world-space relative to character rotation.
		moveVector = transform.TransformDirection(moveVector);
		
		//	Normalized moveVector if magniture > 1.
		if(moveVector.magnitude > 1){
			moveVector = Vector3.Normalize(moveVector);
		}
		
		moveVector *= speed;
		
		//	Reapply vertical vlocity to moveVector.y.
		moveVector = new Vector3(moveVector.x, verticalVelocity, moveVector.z);
		
		applyGravity();
		
		cf = cc.Move(moveVector * Time.deltaTime);
	}
	
	void applyGravity(){
		if(moveVector.y > -terminalVelocity){
			moveVector = new Vector3(moveVector.x, (moveVector.y - gravity * Time.deltaTime), moveVector.z);
		}
		if(cc.isGrounded && moveVector.y < -1){
			moveVector = new Vector3(moveVector.x, -1, moveVector.z);
		}
	}
	
	public void jump(){
		if(cc.isGrounded){
			verticalVelocity = jumpSpeed;
		}
	}
	
	bool isGrounded() {
		return cc.isGrounded;
		//return (cf & CollisionFlags.CollidedBelow) != 0;
	}
	
	bool isCeiled() {
		return (cf & CollisionFlags.CollidedAbove) != 0;	
	}
	
	bool isVerticallyCollided() {
		return isGrounded() || isCeiled();
	}
}
