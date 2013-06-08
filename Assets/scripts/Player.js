#pragma strict
 
/***********************************************************************
 * Notes
 ***********************************************************************/
 
/*
 * This is a boilerplate controller for a 2D or 2.5D platform game.
 * To that end, this controller allows for movement along the X and Y
 * axes only. There is built-in support for jumping, double jumping,
 * rotating in 3D (as opposed to 2D), setting a spawn point, etc.
 * This script was influenced by Unity's 2D Gameplay Tutorial:
 * http://unity3d.com/support/resources/tutorials/2d-gameplay-tutorial.
 */
 
/***********************************************************************
 * Requires
 ***********************************************************************/
 
// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)
 
/***********************************************************************
 * Variables
 ***********************************************************************/
 
var spawnPoint : Transform; // The character will spawn here
var movement : Movement;
var collision : CollisionFlags;
 
private var controller : CharacterController;

/***********************************************************************
 * Classes
 ***********************************************************************/
 
class Movement {
 
	/*******************************
	 * Public (Inspector) variables
	 *******************************/
 
	var enabled : boolean = true; // Is the character controller enabled?
	var gravity : float = 20;
	var jumpHeight : float = 8;
	var walkSpeed : float = 6;
	var runSpeed : float = 10;
	var rotate : boolean = false; // Should the character rotate?
	var rotateIn3D : boolean = false; // Should the character be rotated in 3D?
	var rotationSmoothing : float = 10; // Rotation Smoothing speed (for "Rotate In 3D")
 
	/*******************************
	 * NonSerialized variables
	 *******************************/
 
	// The character's current horizontal direction
	@System.NonSerialized
	var horizontalDirection : int;
 
	// The character's current direction (on all planes)
	@System.NonSerialized
	var direction : Vector3;
 
	// The character's current movement offset
	@System.NonSerialized
	var offset : Vector3;
 
	/*******************************
	 * Jumping
	 *******************************/
 
	// Did the user press the jump input button while midair?
	@System.NonSerialized
	var usedExtraJump : boolean = false;
}
 
/***********************************************************************
 * Unity Functions
 ***********************************************************************/
 
function Awake() {
	controller = GetComponent(CharacterController);
	Spawn();
}
 
function FixedUpdate() {
	// Make sure the character stays in the 2D plane
	transform.position.z = 0;
}
 
function Update() {
	// GetAxisRaw("Horizontal") will return either -1 or 1 while the left or right input is depressed
	// Otherwise, GetAxisRaw("Horizontal") returns 0 for no input
	movement.horizontalDirection = (movement.enabled) ? Input.GetAxisRaw("Horizontal") : 0;
	if (movement.horizontalDirection != 0) movement.direction = Vector3(movement.horizontalDirection, 0, 0);
	MoveCharacter();
}
 
/***********************************************************************
 * Custom Functions
 ***********************************************************************/
 
function Spawn() {
	transform.position = spawnPoint.position;
}
 
// Move the character using Unity's CharacterController.Move function
// http://docs.unity3d.com/Documentation/ScriptReference/CharacterController.Move.html
function MoveCharacter() {
	ApplyMovement();
	ApplyGravity();
	// Move the character (with deltaTime to ensure frame rate independence)
	collision = controller.Move(movement.offset * Time.deltaTime);
}
 
function ApplyMovement() {
	var speed = movement.walkSpeed;
	
	switch (controller.isGrounded) {
		// The character is on the ground
		case true:
			movement.usedExtraJump = false;
			if (movement.enabled) {
				var isRunning = Input.GetButton("Run");
				if(isRunning){
					speed = movement.runSpeed;
				}
				
				movement.offset = Vector3(Input.GetAxis("Horizontal"), 0, 0) * speed;
				
				if(Input.GetButtonDown("Jump")){
					ApplyJump();
				}
			} else {
				movement.offset = Vector3.zero;
			}
		break;
 
		// The character is midair
		case false:
			if (movement.enabled) {
				movement.offset.x = Input.GetAxis("Horizontal") * speed;
				// Apply an extra jump if the jump input button is pressed a second time
				// The final jump height will be greatest at the apex of the first jump
				if (Input.GetButtonDown("Jump") && ! movement.usedExtraJump) {
					movement.usedExtraJump = true;
					// ApplyJump();
				}
				
				if(isCeiled()){
					movement.offset.y = -speed / 2;
				}
			}
		break;
	}
 
	if (movement.rotate) ApplyRotation();
}
 
function ApplyJump() {
	movement.offset.y = movement.jumpHeight;
}
 
function ApplyRotation() {
	if (movement.direction.x != 0) {
		if (movement.rotateIn3D) {
			// http://docs.unity3d.com/Documentation/ScriptReference/Transform-rotation.html
			transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(movement.direction), Time.deltaTime * movement.rotationSmoothing);
		} else {
			// http://docs.unity3d.com/Documentation/ScriptReference/Quaternion.LookRotation.html
			transform.rotation = Quaternion.LookRotation(movement.direction);
		}
	}
}
 
function ApplyGravity() {
	movement.offset.y -= movement.gravity * Time.deltaTime;
}
	
function isGrounded() : boolean {
	return controller.isGrounded;
}

function isCeiled() : boolean {
	return (collision & CollisionFlags.CollidedAbove) != 0;	
}