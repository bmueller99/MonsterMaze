/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.myController = function ( object, domElement ) {

    // save local object position
    this.localPosition = new THREE.Vector3( 0, 0, 0 );
    this.worldPosition = new THREE.Vector3( 0, 0, 0 );

	this.object = object;
    this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

	// API

	this.movementSpeed = 0.3;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;

    this.clickMove = false;
    this.activeLook = true;
    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;
    this.lookSpeed = 0.005;
    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.noFly = false;
    this.lookVertical = true;
    this.autoForward = false;
    
    this.mouseDragOn = false;

    if ( this.domElement === document ) {

        this.viewHalfX = window.innerWidth / 2;
        this.viewHalfY = window.innerHeight / 2;

    } else {

        this.viewHalfX = this.domElement.offsetWidth / 2;
        this.viewHalfY = this.domElement.offsetHeight / 2;
        this.domElement.setAttribute( 'tabindex', -1 );

    }

	// disable default target object behavior

	// internals

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );




	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown2 = function( event ) {
		if ( event.altKey ) {
			return;
		}
        console.log( " camType == " + camType );
        switch ( camType ) 
        {
            case "thirdPerson":
    		
        		switch ( event.keyCode ) 
        		{
                    // 1, tween cam position to player position 
                    case 49:
                        camType = "firstPerson";
                        cam.position = player.position.clone();
                        cam.lookAt( player.position );
                    break;
                    // 2 
                    case 50:
                        camType = "thirdPerson";
                        cam.position.x = 0;
                        cam.position.y = 250;
                        cam.position.z = 400;
                        cam.lookAt( new t.Vector3( 0, -50, 0 ) );
                    break;
                    // P Pause
                    case 80:
                        if ( runAnim == true ) 
                        { 
                            runAnim = false;
                            $('#pause').fadeIn( 300 );
                        } 
                        else if ( runAnim == false )
                        {
                            runAnim = true;
                            $('#pause').fadeOut( 300 );
                        }
                        
                    break;
        			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;
                    // cursor up, w 
                    case 38: 
        			case 87: 
        			    this.moveState.forward = 1; 
                        this.object.rotation.y = Math.PI/2;
        			break;
        
                    // cursor down, s
                    case 40: 
        			case 83:
        			    this.moveState.back = 1; 
                        this.object.rotation.y = -Math.PI/2;
        			break;
        
                    // cursor left, a
                    case 37: 
        			case 65:
        			    this.moveState.left = 1; 
                        this.object.rotation.y = Math.PI;
        			break;
        
                    // cursor right, d
        			case 39: 
                    case 68:
                        this.moveState.right = 1; 
                        this.object.rotation.y = -2*Math.PI;
                    break;
        		}
            break;
            
            case "firstPerson":
        
                switch ( event.keyCode ) 
                {
                    // 1, tween cam position to player position 
                    case 49:
                        camType = "firstPerson";
                        cam.position = player.position.clone();
                        cam.lookAt( player.position );
                    break;
                    
                    // 2 
                    case 50:
                        camType = "thirdPerson";
                        cam.position.x = 0;
                        cam.position.y = 250;
                        cam.position.z = 400;
                        cam.lookAt( new t.Vector3( 0, -50, 0 ) );
                    break;
                    // P Pause
                    case 80:
                        if ( runAnim == true ) 
                        { 
                            runAnim = false;
                            $('#pause').fadeIn( 300 );
                        } 
                        else if ( runAnim == false )
                        {
                            runAnim = true;
                            $('#pause').fadeOut( 300 );
                        }
                    break;
                    case 16: /* shift */ this.movementSpeedMultiplier = .1; break;
                    // cursor up, w 
                    case 38: 
                    case 87: 
                        this.moveState.forward = 1; 
                    break;
                    // cursor down, s
                    case 40: 
                    case 83:
                        this.moveState.back = 1; 
                    break;
                    // cursor left, a
                    case 37: 
                    case 65:
                        this.moveState.left = 1; 
                    break;
                    // cursor right, d
                    case 39: 
                    case 68:
                        this.moveState.right = 1; 
                    break;
                }
                break;
                
            break;
        }
		this.updateMovementVector();
		this.updateRotationVector();
	};





    this.keydown = function( event ) {
        if ( event.altKey ) { return; }
        //console.log( " camType == " + camType );
        if ( camType == "thirdPerson" ) {
            switch ( event.keyCode ) {
                // 1, tween cam position to player position 
                case 49:
                    camType = "firstPerson";
                    cam.position = player.position.clone();
                    //cam.lookAt( player.position );
                break;
                // 2 
                case 50:
                    camType = "thirdPerson";
                    cam.position.x = 0;
                    cam.position.y = 250;
                    cam.position.z = 400;
                    cam.lookAt( new t.Vector3( 0, -50, 0 ) );
                break;
                // P Pause
                case 80:
                    if ( runAnim == true ) 
                    { 
                        runAnim = false;
                        $('#pause').fadeIn( 300 );
                    } 
                    else if ( runAnim == false )
                    {
                        runAnim = true;
                        $('#pause').fadeOut( 300 );
                    }
                    
                break;
                case 16: /* shift */ this.movementSpeedMultiplier = .1; break;
                // cursor up, w 
                case 38: 
                case 87: 
                    this.moveState.forward = 1; 
                    this.object.rotation.y = Math.PI/2;
                break;
    
                // cursor down, s
                case 40: 
                case 83:
                    this.moveState.back = 1; 
                    this.object.rotation.y = -Math.PI/2;
                break;
    
                // cursor left, a
                case 37: 
                case 65:
                    this.moveState.left = 1; 
                    this.object.rotation.y = Math.PI;
                break;
    
                // cursor right, d
                case 39: 
                case 68:
                    this.moveState.right = 1; 
                    this.object.rotation.y = -2*Math.PI;
                break;
            }
        }
        else if ( camType == "firstPerson" ) {
            switch ( event.keyCode ) {
                // 1, tween cam position to player position 
                case 49:
                    camType = "firstPerson";
                    cam.position = player.position.clone();
                    //cam.lookAt( player.position );
                break;
                
                // 2 
                case 50:
                    camType = "thirdPerson";
                    cam.position.x = 0;
                    cam.position.y = 250;
                    cam.position.z = 400;
                    cam.lookAt( new t.Vector3( 0, -50, 0 ) );
                break;
                // P Pause
                case 80:
                    if ( runAnim == true ) 
                    { 
                        runAnim = false;
                        $('#pause').fadeIn( 300 );
                    } 
                    else if ( runAnim == false )
                    {
                        runAnim = true;
                        $('#pause').fadeOut( 300 );
                    }
                break;
                case 16: /* shift */ this.movementSpeedMultiplier = .1; break;
                // cursor up, w 
                case 38: 
                case 87: 
                    this.moveState.forward = 1; 
                    //this.object.rotation.y = Math.PI;
                    //cam.rotation.y = Math.PI/2;
                break;
                // cursor down, s
                case 40: 
                case 83:
                    this.moveState.back = 1; 
                    //this.object.rotation.y = -Math.PI
                    //cam.rotation.y = 3*Math.PI/2;
                break;
                // cursor left, a
                case 37: 
                case 65:
                    this.moveState.left = 1; 
                    //cam.rotation.y = 4*Math.PI/2;
                    //this.object.rotation.y = Math.PI/2;
                break;
                // cursor right, d
                case 39: 
                case 68:
                    this.moveState.right = 1; 
                    //this.object.rotation.y = -Math.PI/2;
                    //cam.rotation.y = 2*Math.PI/2;
                break;

            }
        }

        this.updateMovementVector();
        this.updateRotationVector();
    };


	this.keyup = function( event ) {

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;
            // 1 
            case 49:
                camType = "firstPerson";
            break;
            // 2 
            case 50:
                camType = "thirdPerson";
            break;

			case 38: this.moveState.forward = 0; break; // up
            case 87: this.moveState.forward = 0; break; // w

            case 40: this.moveState.back = 0; break; // down
			case 83: this.moveState.back = 0; break; // s

            case 37: this.moveState.left = 0; break; // left
			case 65: this.moveState.left = 0; break; // a

            case 39: this.moveState.right = 0; break; // right
			case 68: this.moveState.right = 0; break; // d
		}
		this.updateMovementVector();
		this.updateRotationVector();
	};

    this.mousedown = function ( event ) {
        if ( this.domElement !== document ) this.domElement.focus();

        event.preventDefault();
        event.stopPropagation();

        if ( this.clickMove ) {

            switch ( event.button ) {

                case 0: this.moveState.forward = 1; break;
                case 2: this.moveState.back = 1; break;

            }
        }
        this.mouseDragOn = true;
    };

    this.mouseup = function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        if ( this.clickMove ) {

            switch ( event.button ) {

                case 0: this.moveState.forward = 0; break;
                case 2: this.moveState.back = 0; break;

            }
        }
        this.mouseDragOn = false;
    };


    this.mousemove = function ( event ) {

        if ( this.domElement === document ) {

            this.mouseX = event.pageX - this.viewHalfX;
            this.mouseY = event.pageY - this.viewHalfY;

        } else {

            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

        }
    };

	this.updatePlayer = function( delta ) {

		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;
        
        // save local position for collision test
        this.localPosition = this.object.position.clone();

        //console.log( "local = " + this.object.position.x + " *** " + this.object.position.y + " *** " + this.object.position.z );

        // calculate world position
        ////this.worldPosition = 
//this.object.localToWorld( this.object.position );

        //$( "#debug03" ).html( "local = " + this.localPosition.x + " - " + this.localPosition.y + " - " + this.localPosition.z );
        //$( "#debug03" ).html( "world = " + this.worldPosition.x + " - " + this.worldPosition.y + " - " + this.worldPosition.z );

        // where to move the object?
        var nextStep = new THREE.Vector3( this.localPosition.x + this.moveVector.x * moveMult, 
                                          this.localPosition.y, 
                                          this.localPosition.z + this.moveVector.z * moveMult );
        
        
        //$( "#debug04" ).html( "next = " + nextStep.x + " - " + nextStep.y + " - " + nextStep.z );
        
        
        // if no collision is detected move the object
        if ( checkWallCollision( nextStep ) == false ) {
            
            //console.log(" no Kollision ");
            
            // move object in world space
            // conversion is needed in order to rotate object in this.keydown
            // convert local object position to world object position
            this.object.localToWorld( this.object.position );
            this.object.translateX( this.moveVector.x * moveMult );        
            this.object.translateZ( this.moveVector.z * moveMult );
            // restore local object position
            this.object.worldToLocal( this.object.position );
        }
//this.object.worldToLocal( this.object.position );


            //this.object.lookAt( targetPosition );
        
	};


    
    this.updateCam = function( delta ) {

        var moveMult = delta * this.movementSpeed / 2;
        var rotMult = delta * this.rollSpeed;
        
        // save local position for collision test
        //this.localPosition = this.object.position.clone();
        this.localPosition = cam.position.clone();
        
        //console.log( "local = " + this.localPosition.x + " *** " + this.localPosition.y + " *** " + this.localPosition.z );

        var nextStep = new THREE.Vector3( this.localPosition.x + this.moveVector.x * moveMult, 
                                          this.localPosition.y, 
                                          this.localPosition.z + this.moveVector.z * moveMult );
        
        // if no collision is detected move the object
        if ( checkWallCollisionCam( nextStep ) == false ) {
            //this.object.translateX( this.moveVector.x * moveMult );        
            //this.object.translateZ( this.moveVector.z * moveMult );
            cam.translateX( this.moveVector.x * moveMult );        
            cam.translateZ( this.moveVector.z * moveMult );
        } else
        {
            cam.translateX( -this.moveVector.x * moveMult );        
            cam.translateZ( -this.moveVector.z * moveMult );
        }

        // rotate cam with mouse
        // targetPosition = point the cam looks at, depends only on this.mouseX
        var actualLookSpeed = delta * this.lookSpeed*4;
        this.lon += this.mouseX * actualLookSpeed;  // calculate rotation in degrees
        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        this.phi = ( 90 - this.lat ) * Math.PI / 180; // calculate radiants
        this.theta = this.lon * Math.PI / 180;
        var targetPosition = this.target;
        targetPosition.x = cam.position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
        targetPosition.y = cam.position.y + 100 * Math.cos( this.phi );
        targetPosition.z = cam.position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );
        cam.lookAt( targetPosition );
        player.position = cam.position.clone(); // needed for collision detection player - items
    };


	this.updateMovementVector = function() {

		//var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
        this.moveVector.z = ( -this.moveState.forward + this.moveState.back );
	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};

	this.getContainerDimensions = function() {

		if ( this.domElement != document ) {

			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};

		} else {

			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};

		}

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

	window.addEventListener( 'keydown', bind( this, this.keydown ), false );
	window.addEventListener( 'keyup',   bind( this, this.keyup ), false );

	this.updateMovementVector();
	this.updateRotationVector();

};
