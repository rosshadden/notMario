using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour {
	
	CharacterController cc;
	
	public Vector3 velocity;
	Vector3 accel;
	CollisionFlags cf;
	
	public float speed = 1.0f;
	public float jumpSpeed = 10.0f;
	public float friction = 0.8f;
	public float minSpeed = 0.2f;
	public float gravity = -20.0f;

	// Use this for initialization
	void Start() {
		
		cc = GetComponent<CharacterController>();
		velocity = Vector3.zero;
		accel = Vector3.zero;
		
	}
	
	// Update is called once per frame
	void Update() {
		
		// are we jumping
		bool jumping = Input.GetButtonDown("Jump");
		
		// get the horizontal movement
		var x = Input.GetAxis("Horizontal") * (100 * speed);
		
		// get accelleration from input
		accel = new Vector3(x, 0.0f, 0.0f);
		
		// apply gravity down
		acell.y += gravity;
		
		// apply accelleration to velocity
		velocity += accel * Time.deltaTime;
		
		// apply friction
		velocity.x *= friction;
		
		// kill vertical velocity when hitting ceiling or floor
		if (isVerticallyCollided()) {
			velocity.y = 0.0f;
		}
		
		// jumping
		if (isGrounded() && jumping) {
			velocity.y += jumpSpeed;
		}
		
		// if our speed is lower than min speed then cancel it entirely
		if (Mathf.Abs(velocity.x) < minSpeed) velocity.x = 0.0f;
		
		// update collision flags from move
		cf = cc.Move(velocity * Time.deltaTime);

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
