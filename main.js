// Monster Madness

var myphi;

var	nextStep = new THREE.Vector3(0,0,0);

var  moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };

var movementSpeed = 0.3;


var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
    INTROWIDTH = 400,
    INTROHEIGHT = 200,
	INTROASPECT = INTROWIDTH / INTROHEIGHT,
    ASPECT = WIDTH / HEIGHT,
	UNITSIZE = 40,
	WALLHEIGHT = UNITSIZE / 3,
	MOVESPEED = 40,
	LOOKSPEED = 0.075,
	BULLETMOVESPEED = MOVESPEED * 2,
	PROJECTILEDAMAGE = 100;
var t = THREE, arrow1, scene, world = [], raycasterCam, raycasterPlayer, cam, renderer, controls, clock, projector, model, skin, groundMirror, player, helpPlayer, playerPos;
var runAnim = true, mouse = { x: 0, y: 0 }, kills = 0, myhealth = 100;
var camType = "firstPerson", run, nextState, score = 0;
var ai = []; // enemies
var health = []; // health items
var ammus = []; // ammu items
var coins = []; // coin items
var item; // helper, single item like ammo or health
var ammuscore = 2000;
var ring; 
var assetsToLoad = []; // sounds
// Variable to count the number of assets the game needs to load
var assetsLoaded = 0;
var titleMusic, gameMusics=[], gameMusic0, gameMusic1, gameOverMusic, ammuPickup, ouch, levelin, playerDead, ringPickup, healthPickup, gushot;
var stats = new Stats();
var tweenPlayerDead, tweenM;
var titleAnimationTimer, runTimer, radarTimer;
var introCanvas, introPlayer, introCam, enemy1, enemy2, enemy3, enemy4, group, introRenderer;
var lives = [], LIVES = 2, numLives = LIVES;
var isTween = false;
var controller, playerController, camController;

var lookSpeed = 0.005,
    lat = 0,
    lon = 0,
    phi = 0,
    theta = 0;

var playerGeo = new t.SphereGeometry( 10, 10, 10 ),
    playerMaterial = new t.MeshBasicMaterial( { map: t.ImageUtils.loadTexture('images/face.png') } );

var radarvisible = true;

// level management 

var l01;			// data for first level
var l02;			// data for second level
var levels=[];	// array for all levels
 
var LEVEL = 0; 	// level counter, start with first level
var level;		// current level object



// Initialize and run on document ready
$(document).ready( function() 
{
    // load the sounds
    titleMusic = document.querySelector( "#titlemusic" );
    titleMusic.addEventListener( "canplaythrough", loadHandler, false );
    titleMusic.load();
    assetsToLoad.push( titleMusic );
    
    gameMusic0 = document.querySelector( "#gamemusic0" );
    gameMusic0.addEventListener( "canplaythrough", loadHandler, false );
    gameMusic0.load();
    assetsToLoad.push( gameMusic0 );
    gameMusic1 = document.querySelector( "#gamemusic1" );
    gameMusic1.addEventListener( "canplaythrough", loadHandler, false );
    gameMusic1.load();
    assetsToLoad.push( gameMusic1 );

    gameOverMusic = document.querySelector( "#gameovermusic" );
    gameOverMusic.addEventListener( "canplaythrough", loadHandler, false );
    gameOverMusic.load();
    assetsToLoad.push( gameOverMusic );

    playerDead = document.querySelector( "#playerdead" );
    playerDead.addEventListener( "canplaythrough", loadHandler, false );
    playerDead.load();
    assetsToLoad.push( playerDead );

    ouch = document.querySelector( "#ouch" );
    ouch.addEventListener( "canplaythrough", loadHandler, false );
    ouch.load();
    assetsToLoad.push( ouch );

    levelin = document.querySelector( "#levelin" );
    levelin.addEventListener( "canplaythrough", loadHandler, false );
    levelin.load();
    assetsToLoad.push( levelin );

    ammuPickup = document.querySelector( "#ammupickup" );
    ammuPickup.addEventListener( "canplaythrough", loadHandler, false );
    ammuPickup.load();
    assetsToLoad.push( ammuPickup );

    healthPickup = document.querySelector( "#healthpickup" );
    healthPickup.addEventListener( "canplaythrough", loadHandler, false );
    healthPickup.load();
    assetsToLoad.push( healthPickup );

    ringPickup = document.querySelector( "#ringpickup" );
    ringPickup.addEventListener( "canplaythrough", loadHandler, false );
    ringPickup.load();
    assetsToLoad.push( ringPickup );

    gunshot = document.querySelector( "#gunshot" );
    gunshot.addEventListener( "canplaythrough", loadHandler, false );
    gunshot.load();
    assetsToLoad.push( gunshot );

    meinleben = document.querySelector( "#meinleben" );
    meinleben.addEventListener( "canplaythrough", loadHandler, false );
    meinleben.load();
    assetsToLoad.push( meinleben );

	l01 = new level01(); // contains data of level 0
	l02 = new level02(); // contains data of level 1
	
	levels = [ l01, l02 ]; // contains level objects

	LEVEL = 0; // start with this level number, starting at 0
	level = levels[ LEVEL ]; // this is the current level object 

	console.log("document.load Level = " + LEVEL );
	
	// same for music
	gameMusics = [ gameMusic0, gameMusic1, gameMusic0 ];
	
    createScreens();
    
    $( '#instructions, #intro, #radar, #gameover, #pause, #ammo, #ammoText, #healthbar, #score, #scoreText, #nextLevel' ).fadeOut( 300 );

});

function loadHandler()
{ 
  assetsLoaded++;
  if( assetsLoaded === assetsToLoad.length )
  {
    titleMusic.removeEventListener("canplaythrough", loadHandler, false);
    gameMusic0.removeEventListener("canplaythrough", loadHandler, false);
    gameMusic1.removeEventListener("canplaythrough", loadHandler, false);
    gameOverMusic.removeEventListener("canplaythrough", loadHandler, false);
    playerDead.removeEventListener("canplaythrough", loadHandler, false);
    ouch.removeEventListener("canplaythrough", loadHandler, false);
    levelin.removeEventListener("canplaythrough", loadHandler, false);
    ammuPickup.removeEventListener("canplaythrough", loadHandler, false);
    healthPickup.removeEventListener("canplaythrough", loadHandler, false);
    ringPickup.removeEventListener("canplaythrough", loadHandler, false);
    gunshot.removeEventListener("canplaythrough", loadHandler, false);
    meinleben.removeEventListener("canplaythrough", loadHandler, false);

    // start game 
    init(); // call only once!
    titleScreen();
  }
}

function titleScreen()
{
    $('#logo_M').css( { visibility: "visible" } );
    $('#logo_O').css( { visibility: "visible" } );
    $('#logo_N').css( { visibility: "visible" } );
    $('#logo_S').css( { visibility: "visible" } );
    $('#logo_T').css( { visibility: "visible" } );
    $('#logo_E').css( { visibility: "visible" } );
    $('#logo_R').css( { visibility: "visible" } );

    myhealth = 100;
    
    $( '#ammo, #healthbar, #score' ).fadeOut( 300 );
    gameOverMusic.pause();
    titleMusic.currentTime = 0;
    titleMusic.volume = 0.5;
    titleMusic.play();
    nextState = instructionsScreen;    

	group.rotation.y = 0;

    titleAnimationTimer = setInterval( titleAnimation, 20 );
    
    initTweens(); 

    tweenM.start();
    tweenO.start();
    tweenN.start();
    tweenS.start();
    tweenT.start();
    tweenE.start();
    tweenR.start();
    
    $( '#intro, #intropic, #introWebGL, #introtext' ).fadeIn( 300 );
}

function titleAnimation()
{
    TWEEN.update();
    
    group.rotation.y += 0.1;
    
    //requestAnimationFrame( titleAnimation );    
    introRenderer.render( introScene, introCam ); // Repaint
}


function instructionsScreen()
{
    nextState = runGame;    
    $('#instructions').fadeIn( 300 );
}
function runGame()
{
    myhealth = 100;
    
    $( '#instructions, #intro' ).fadeOut( 300 );
    $( '#WebGL-output, #radar, #logo, #ammo, #ammoText, #healthbar, #score, #scoreText' ).fadeIn( 3000 );

    runAnim = false;

/*    

    isTween = true; // don't change cam position in main.js, because we do it here 
    
    // source position
    myY = { 
                x : 0, 
                y : 1000,
                z : 1000
         };
           
    // taget position is player position     
    tox = 0;
    toy = 250;  
    toz = 400;

    camTweenx = new TWEEN.Tween( myY )
    .to( { x: tox }, 2000 ).easing( TWEEN.Easing.Quadratic.In ).onUpdate( function() { cam.position.x = myY.x; } ).start();
    camTweeny = new TWEEN.Tween( myY )
    .to( { y: toy }, 2000 ).easing( TWEEN.Easing.Quadratic.In ).onUpdate( function() { cam.position.y = myY.y; } ).start();
    camTweenz = new TWEEN.Tween( myY )
    .to( { z: toz }, 2000 ).easing( TWEEN.Easing.Quadratic.In ).onUpdate( function() { cam.position.z = myY.z; } ).start();

    cam.lookAt( player.position );
    setTimeout( function(){ isTween = false; }, 2000 );
   
*/    
    // end animation    
    
    runAnim = true;
    
    titleMusic.pause();
    
    gameMusic = gameMusics[LEVEL];
    //console.log("gameMusic = " + gameMusic );
    gameMusic.currentTime = 0;
    gameMusic.play();
    gameMusic.volume = 1.0

    //if ( radarvisible == true ) 
    radarTimer = setInterval( drawRadar, 100 );
    
    //run2();
    runTimer = setInterval( render, 20 );
}

/*
 * last level finished or all lives lost
 * 
 */
function showGameOverScreen()
{
    clearInterval( runTimer ); 		// stop game loop
    clearInterval( radarTimer ); 	// stop radar loop
    
    runAnim = false;
    score = 0, ammuscore = 100;
    $('#ammo').html( ammuscore );
    $('#score').html( score );

    myhealth = 100;
    player.dead = false;
    tweenPlayerDead.stop();
   
   	LEVEL = 0;
   	console.log("showGameOverScreen LEVEL == " + LEVEL );
	level = levels[ LEVEL ];

    $( '#WebGL-output, #radar, #logo, #ammo, #ammoText, #healthbar, #score, #scoreText' ).fadeOut( 300 );
    $( '#gameover' ).fadeIn( 300 );
   
    gameMusic.pause();
    gameOverMusic.currentTime = 0;
    gameOverMusic.play();
    gameOverMusic.volume = 0.5;
    // continue with click handler
}

/*
 * lost one live, continue with next
 * 
 */
function nextLive() {

    tweenPlayerDead.stop();
    
    setupPlayer();
    player.dead = false; // turn on collision test with NPC
    
    myhealth = 100;
    $('#healthbar').css( { left: WIDTH/4 } ); // restore health bar
    $('#healthbar').css( { width: WIDTH/2 } );

    playerDead.pause();
    gameMusic.currentTime = 0;
    gameMusic.play();
    gameMusic.volume = 0.5;
}

/*
 *  if level is finished continue with next level until last level, game over (end of last level) is handled in render loop
 * 
 */
function nextLevel() {
    clearInterval( runTimer ); // stop game loop
    clearInterval( radarTimer ); // stop radar loop
    level = levels[ LEVEL ]; // this is the current level object 
	$('#nextLevel').fadeOut( 600 );
    //score = 0, ammuscore = 0;
    //$('#ammo').html( ammuscore );
    $('#score').html( score );
    $('#healthbar').css( { left: WIDTH/4 } ); // restore health bar
    $('#healthbar').css( { width: WIDTH/2 } );

	setupEnemies();

    setupPlayer();

	setupScene();
    runGame();
}



/*
 *  define game states and click handler
 * 
 */
function createScreens()
{
    $('body').append( '<div id="intro"> </div>' );
    
    $('#intro').css( {
        width: WIDTH, height: HEIGHT 
        //width: WIDTH/2, height: HEIGHT/2    
    } ).bind( "click", function( e ) {
        e.preventDefault();
        console.log( "title click" );
       
        tweenM.stop();
        tweenO.stop();
        tweenN.stop();
        tweenS.stop();
        tweenT.stop();
        tweenE.stop();
        tweenR.stop();
        
        $('#logo_M').css( { visibility: "hidden" } );
        $('#logo_O').css( { visibility: "hidden" } );
        $('#logo_N').css( { visibility: "hidden" } );
        $('#logo_S').css( { visibility: "hidden" } );
        $('#logo_T').css( { visibility: "hidden" } );
        $('#logo_E').css( { visibility: "hidden" } );
        $('#logo_R').css( { visibility: "hidden" } );

        clearInterval( titleAnimationTimer );
        $(' #intropic, #introWebGL, #introtext' ).fadeOut( 300 );
        nextState();
    });

    $('body').append( '<div id="intropic"><img src="images/titlescreen.png"></div>' );
    //document.getElementById( 'intropic' ).left = WIDTH/2 - 200;
    //document.getElementById( 'intropic' ).top = 100;
    $('#intropic').css( { left: WIDTH/2 - 100 } );

    $('body').append( '<div id="introtext">Click to continue...</div>' );
    //document.getElementById( 'intropic' ).left = WIDTH/2 - 200;
    //document.getElementById( 'intropic' ).top = 100;
    $('#introtext').css( { left: WIDTH/2 - 160 } );

    
    $('body').append( '<div id="logo_M"><img src="images/logo_M.png"></div>' );
    $('body').append( '<div id="logo_O"><img src="images/logo_O.png"></div>' );
    $('body').append( '<div id="logo_N"><img src="images/logo_N.png"></div>' );
    $('body').append( '<div id="logo_S"><img src="images/logo_S.png"></div>' );
    $('body').append( '<div id="logo_T"><img src="images/logo_T.png"></div>' );
    $('body').append( '<div id="logo_E"><img src="images/logo_E.png"></div>' );
    $('body').append( '<div id="logo_R"><img src="images/logo_R.png"></div>' );

    $('#logo_M').css( { left: WIDTH/2-222+"px" } );
    $('#logo_O').css( { left: WIDTH/2-222+84+"px" } );
    $('#logo_N').css( { left: WIDTH/2-222+84+67+"px" } );
    $('#logo_S').css( { left: WIDTH/2-222+84+67+61+"px" } );
    $('#logo_T').css( { left: WIDTH/2-222+84+67+61+49+"px" } );
    $('#logo_E').css( { left: WIDTH/2-222+84+67+61+49+61+"px" } );
    $('#logo_R').css( { left: WIDTH/2-222+84+67+61+49+61+53+"px" } );

    initTweens(); 

    introScene = new t.Scene(); 
    
    // set up player
    var playerGeo = new t.SphereGeometry( 10, 10, 10 );
    var playerMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/face.png')});
    introPlayer = new t.Mesh( playerGeo, playerMaterial );

    introPlayer.position.x = Math.cos( 0.2 ) * 50;;
    introPlayer.position.y = 12;
    introPlayer.position.z = Math.sin( 0.2 ) * 50;

    aiMaterial2 = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/smiley001.jpg')});
    aiMaterial = new t.MeshBasicMaterial({ color: 0xE2cb9b, map: t.ImageUtils.loadTexture('images/smilie002.png')});
    //var aiMaterial = new t.MeshBasicMaterial({ color: 0xE2cb9b, map: t.ImageUtils.loadTexture('images/neon_acid.png')});
    //var aiMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/smiley003.jpg')});

    aiGeo2 = new t.SphereGeometry( 10, 10, 10 );
    
    enemy1 = new t.Mesh( aiGeo2, aiMaterial2 );
    enemy1.position.x = Math.cos( 0.8 ) * 50;
    enemy1.position.y = 12;
    enemy1.position.z = Math.sin( 0.8 ) * 50;

    enemy2 = new t.Mesh( aiGeo2, aiMaterial2 );
    enemy2.position.x = Math.cos( 1.4 ) * 50;
    enemy2.position.y = 12;
    enemy2.position.z = Math.sin( 1.4 ) * 50;

    enemy3 = new t.Mesh( aiGeo2, aiMaterial2 );
    enemy3.position.x = Math.cos( 2.0 ) * 50;
    enemy3.position.y = 12;
    enemy3.position.z = Math.sin( 2.0 ) * 50;

    enemy4 = new t.Mesh( aiGeo2, aiMaterial2 );
    enemy4.position.x = Math.cos( 2.6 ) * 50;
    enemy4.position.y = 12;
    enemy4.position.z = Math.sin( 2.6 ) * 50;

    // set up camera
    introCam = new t.PerspectiveCamera( 60, INTROASPECT, 1, 10000 ); // FOV, aspect, near, far
    introCam.position.x = 0;
    introCam.position.y = 70;
    introCam.position.z = 80;
    introScene.add( introCam );

    group = new THREE.Object3D();
    group.add( introPlayer );
    group.add( enemy1 );
    group.add( enemy2 );
    group.add( enemy3 );
    group.add( enemy4 );
    
    introScene.add( group );
    introCam.lookAt( new t.Vector3( 0, -10, 0 ) );
            
    // Lighting
    var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
    directionalLight1.position.set( 0.5, 1, 0.5 );
    introScene.add( directionalLight1 );

    var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.5 );
    directionalLight2.position.set( -0.5, -1, -0.5 );
    introScene.add( directionalLight2 );
    
    introRenderer = new THREE.WebGLRenderer( { alpha: true } ); // needs alpha= true for custom color, because otherwise alpha=0!
    introRenderer.setSize( INTROWIDTH, INTROHEIGHT );
/*
    introCanvas = document.getElementById( 'introWebGL' );
    introCanvas.style.left = WIDTH/2 - INTROWIDTH/2 + "px";
    introRenderer.setClearColorHex( 0x000000, 1 ); // set background-color of canvas
    introCanvas.appendChild( introRenderer.domElement );    
*/
    $("#introWebGL").append( introRenderer.domElement );
    $("#introWebGL").css( { left: WIDTH/2-INTROWIDTH/2 } ); // center

// end titleScreen




    $('body').append( '<div id="instructions"><img src="images/instructions.jpg"><br><br><br>Click to start game!</div>' );

    $('#instructions').css( {
        width: WIDTH, 
        height: HEIGHT
        } ).click( 'click', function( e ) {
           e.preventDefault();
           //console.log( "instructions click" );
			

			$( '#instructions, #intro' ).fadeOut( 300 );
			$( '#WebGL-output' ).fadeIn( 300 );

			titleMusic.pause();

		    levelin.currentTime = 0;
		 	levelin.volume = 1.0;
            levelin.play();

			var showlevel = LEVEL+1;
            $('#nextLevel').html( "<br>" + showlevel );
			$('#nextLevel').fadeIn( 600 );
			setTimeout( function()
            {
				$('#nextLevel').fadeOut( 600 );
				nextState();	
            } , 2000 );

           //nextState();
    });

    $('body').append( '<div id="gameover"><br><br><br>Game over!<br><br><br>Click to restart game!</div>' );
    $('#gameover').css( {
        width: WIDTH, 
        height: HEIGHT
        } ).click( 'click', function( e ) {
           e.preventDefault();
           
           $('#gameover').fadeOut( 300 );
           myhealth = 100;

           // center healthbar   
           $('#healthbar').css( { left: WIDTH/4 } );
           $('#healthbar').css( { width: WIDTH/2 } );
           
           // initialize scene (walls), player, items and NPCs 
           setupEnemies();
           setupScene();
           setupPlayer();
            
           // no nextState() here!
           titleScreen();
           //console.log(" numLives = " + numLives );
    });


    $('body').append( '<div id="pause"><br><br>Press p to continue!</div>' );
    $('#pause').css( { top:HEIGHT/2-39-100, left:WIDTH/2-108, width: 216, height: 78 } );

    $('body').append( '<div id="nextLevel"></div>' );
    $('#nextLevel').css( { top:HEIGHT/2-39-100, left:WIDTH/2-96, width: 193, height:64 } );

    $('body').append( '<div id="message"></div>' );
    $('#message').css( { top:HEIGHT/2-39-100, left:WIDTH/2-200, width: 400, height:64 } );

    // center healthbar   
    $('#healthbar').css( { left: WIDTH/4 } );
    
    $('body').append('<canvas id="radar"></canvas>');
    document.getElementById('radar').width  = level.mapW*10;
    document.getElementById('radar').height = level.mapH*10;
    
    $('body').append('<div id="logo"><img src="images/monsters.png"></div>');
    
    //$('#logo').css( { width: WIDTH, height: HEIGHT } );
    var logo = document.getElementById('logo');
    logo.style.height = "50px";
    logo.style.width = "100%";

    // Set up "hurt" flash
    $('body').append('<div id="hurt"></div>');
    $('#hurt').css( { width: WIDTH, height: HEIGHT } );

    $('#radar, #logo' ).fadeOut();
}

function initTweens()
{
    var mypos = { y: 70 };
    to = 120;
    tweenM = new TWEEN.Tween( mypos )
        .to( { y: to }, 380 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_M').css( { top: this.y+"px" } );});
    tweenO = new TWEEN.Tween( mypos )
        .to( { y: to }, 340 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_O').css( { top: this.y+"px" } );});
    tweenN = new TWEEN.Tween( mypos )
        .to( { y: to }, 360 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_N').css( { top: this.y+"px" } );});
    tweenS = new TWEEN.Tween( mypos )
        .to( { y: to }, 400 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_S').css( { top: this.y+"px" } );});
    tweenT = new TWEEN.Tween( mypos )
        .to( { y: to }, 390 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_T').css( { top: this.y+"px" } );});
    tweenE = new TWEEN.Tween( mypos )
        .to( { y: to }, 410 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_E').css( { top: this.y+"px" } );});
    tweenR = new TWEEN.Tween( mypos )
        .to( { y: to }, 370 )
        .easing( TWEEN.Easing.Quadratic.In ).repeat( Infinity ).yoyo( true ).onUpdate( function(){$('#logo_R').css( { top: this.y+"px" } );});
    
}


function init() 
{
	clock = new t.Clock(); // we use time based animation not frame based
	projector = new t.Projector(); // used in bullet projection 3d <-> 2d
	raycasterCam = new t.Raycaster();
    raycasterPlayer = new t.Raycaster();
	scene = new t.Scene(); 
	//scene.fog = new t.FogExp2(0x000000, 0.010); // color, density

    // set up cam
    cam  = new t.PerspectiveCamera( 60, ASPECT, 1, 10000 ); // FOV, aspect, near, far
    //cam.rotation.y = Math.PI/2;
    scene.add( cam );
	
    setupEnemies();
    setupPlayer();

    //document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    addEventListener( 'mousemove', mousemove, false );
    //addEventListener( 'mousedown', mousedown, false );
    //addEventListener( 'mouseup',   mouseup,   false );

    addEventListener( 'keydown', keydown, false );
    addEventListener( 'keyup',   keyup, false );

    // set up lighting
    var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 1.7 );
    directionalLight1.position.set( 0.5, 1, 0.5 );
    scene.add( directionalLight1 );
    var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 1.5 );
    directionalLight2.position.set( -0.5, -1, -0.5 );
    scene.add( directionalLight2 );

    renderer = new t.WebGLRenderer( { alpha: true } );
    renderer.setSize( WIDTH, HEIGHT );
	$("#WebGL-output").append( renderer.domElement );
	$("#WebGL-output").css( { width: WIDTH, height: HEIGHT } );
	//renderer.shadowMapEnabled = true;

    // set up world
    setupScene(); // needs renderer!
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	// shoot on click
	$( document ).click( function( e ) {
		e.preventDefault;
		if ( e.which === 1 ) { // left click only
			createBullet( cam, "cam" );
		}
	});
}


// the game loop

function run2() {

    TWEEN.update();

    //render();
    nextState();
    if ( runAnim == true ) 
    {
        requestAnimationFrame( run2 );
    }
}


function render() 
{
    TWEEN.update();
    stats.update();
    
    if ( runAnim == false ) return; // needed for pause key
    
	delta = clock.getDelta(), speed = delta * BULLETMOVESPEED;
	var aispeed = delta * MOVESPEED;

	updateCam( delta );

    // rotate lives
    //for ( var i = lives.length-1; i >= 0; i-- ) lives[i].rotation.y += 0.04;
    
	// rotate health cubes
	for ( var i = health.length-1; i >= 0; i-- )
	{
        health[i].rotation.x += 0.004;
        health[i].rotation.y += 0.008;
	}
    // rotate ammo	
    for ( var i = ammus.length-1; i >= 0; i-- ) ammus[i].rotation.y += 0.028;

    // rotate coins  
    for ( var i = coins.length-1; i >= 0; i-- ) coins[i].rotation.y += 0.1;

	// rotate ring
    ring.rotation.x += 0.008;
	ring.rotation.z += 0.004;
	
	
	// update bullets
	for ( var i = bullets.length-1; i >= 0; i-- ) {
	    
		var b = bullets[i], bulletPos = b.position, d = b.ray.direction;
		
		
		// collision bullet with wall
		if ( checkWallCollision3( bulletPos ) ) 
		{
			bullets.splice( i, 1 );
			scene.remove( b );
			continue;
		}
		
		// collision bullet with monster
		var hit = false;
		for ( var j = ai.length-1; j >= 0; j-- ) {

			var enemy = ai[j];

            var enemyPos = enemy.position;
			if ( distance( bulletPos.x, bulletPos.z, enemyPos.x, enemyPos.z ) < 9 && b.type != "enemy" )
			{ 
		
		        meinleben.currentTime = 0;
                meinleben.volume = 0.5;
                meinleben.play();

				//console.log("collision bullet monster!!!!" );
				console.log("b.length == " + bullets.length );
				
				bullets.splice( i, 1 );
				scene.remove( b );
				enemy.health -= PROJECTILEDAMAGE;
				/*
				var color = enemy.material.color, percent = enemy.health / 100;
				enemy.material.color.setRGB(
						percent * color.r,
						percent * color.g,
						percent * color.b
				);
				*/
				hit = true;
				break;
			}
		}
		
		// enemy bullet hits player
		if ( distance( bulletPos.x, bulletPos.z, cam.position.x, cam.position.z) < 12 && b.owner != cam ) 
		{
			ouch.currentTime = 0;
			ouch.volume = 1.0;
			ouch.play();
                
			$('#hurt').fadeIn(75);
			myhealth -= 10;
			if ( myhealth < 0 ) myhealth = 0;
			//val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health;
            $('#healthbar').css( { width: 0.01 * myhealth * WIDTH/2 } );
			
			bullets.splice( i, 1 );
			scene.remove( b );
			$('#hurt').fadeOut( 350 );
		}
		
		// no hit, move bullets of player
		
		if ( !hit ) {
			//if ( camType == 'firstPerson' || camType == 'thirdPerson' )
			if ( camType == 'firstPerson' )
			{
				b.translateX( 3*speed * d.x );
				b.translateZ( 3*speed * d.z );
			
			}
			else if ( camType == 'thirdPerson' )
			{
				if ( b.type == "enemy" )
				{
					b.translateX( 3*speed * d.x );
					b.translateZ( 3*speed * d.z );
				}
				else
				{
					//console.log("player.rotation.y == " + player.rotation.y*180/Math.PI );
					//console.log("player.direction == " + player.direction );
					//console.log("speed == " + speed );
					
					// rechts
					if ( player.direction == "right" )
					{
						b.translateX( speed * 5 );
					}
					// links
					if ( player.direction == "left" )
					{
						b.translateX( -speed * 5 );
					}
					// back
					if ( player.direction == "back" )
					{
						b.translateZ( speed * 5 );
					}
					// forward
					if ( player.direction == "forward" )
					{
						b.translateZ( -speed * 5 );
					}
				}
			}
			
		}
	} // end loop update bullets
	
	
	// update enemies
	for ( var i = ai.length-1; i >= 0; i-- ) {
		
		var enemy = ai[ i ];
		
		// enemy is dead
		if ( enemy.health <= 0 ) {
			ai.splice( i, 1 );
			scene.remove( enemy );
			kills++;
			$('#score').html( kills * 100 );
			//addAI();
		}

		
		// move enemies

		
		// check if direction of movement changes, if so rotation of enemy is needed
		
		var r = Math.random();
		if ( r > 0.995 && enemy.animation == false ) 
		{
		    enemy.animation = true;
		    
			// random number between -1 and 1 
			// determines direction of movement
			///enemy.lastRandomX = Math.random() * 2 - 1;
			///enemy.lastRandomZ = Math.random() * 2 - 1;
			
			// random number between 0 and 3
            var myNumber = Math.floor( Math.random()*4 ); // 0, 1, 2, 3
            
            //console.log("angle = " + angle );
            
            var angleGrad = myNumber * 90; // 0, 90, 180, 270
            var angleRadiant = angleGrad * Math.PI/180;

            nextStep = new THREE.Vector3(	enemy.position.x + aispeed * enemy.lastRandomX, 
                                            enemy.position.y, 
                                            enemy.position.z + aispeed * enemy.lastRandomZ );

			var help = Math.random()*2-1;
			if ( help >= 0 )
			{
				myphi = angleRadiant;
			}
			else
			{
				myphi = -angleRadiant;
			}
            enemy.numRadians = Math.floor( (Math.abs( myphi/enemy.STEP )+0.5) ); // needed for animation
		}	
		
		else
		
        {
            // no change in direction, so move the enemy in old direction
            
            // do we have an animation?
            
            if ( enemy.animation == true )
            {
            	
            	if ( myphi < 0 )
            	{
	                enemy.rotation.y -= enemy.STEP;
            	}
            	else if ( myphi > 0 )
            	{
                 	enemy.rotation.y += enemy.STEP;
            	}
                
                enemy.radiansCounter++;
                
                if ( enemy.radiansCounter >= enemy.numRadians )
                {
                    enemy.radiansCounter = 0;
                    enemy.animation = false;
					var erot = Math.floor((enemy.rotation.y*180/Math.PI)+0.5)%360;
		            // nach unten
		            if ( erot == 0 )
		            {
		            	//console.log("nach unten");
		            	enemy.lastRandomZ = 0;
		            	enemy.lastRandomX = 1;
		            }
		            // nach rechts
		            if ( erot == 90 )
		            {
		            	//console.log("nach rechts");
		            	enemy.lastRandomZ = -1;
		            	enemy.lastRandomX = 0;
		            }
		            // nach oben
		            if ( erot == 180 )
		            {
		            	//console.log("nach oben");
		            	enemy.lastRandomZ = 0;
		            	enemy.lastRandomX = -1;
		            }
		            // nach links
		            if ( erot == 270 )
		            {
		            	//console.log("nach links");
		            	enemy.lastRandomZ = 1;
		            	enemy.lastRandomX = 0;
		            }

                    return; // no movement until animation is complete                    
                }
            }
            else
            {
            	//console.log("no rotation");
            	
                // no animation, so simply move enemy in old direction

                nextStep = new THREE.Vector3( enemy.position.x + aispeed * enemy.lastRandomX, 
                                                  enemy.position.y, 
                                                  enemy.position.z + aispeed * enemy.lastRandomZ );
                                                  
        		
        		// check if enemy collides with wall
                if ( !checkWallCollisionEnemies( nextStep ) )
                //if ( !checkWallCollision3( nextStep ) )
                {
        			// if no collision is detected move the enemy
        			// translation is always done in world space
                    
                    enemy.localToWorld( enemy.position );
                    enemy.translateX( aispeed * enemy.lastRandomX );
                    enemy.translateZ( aispeed * enemy.lastRandomZ );
                    enemy.worldToLocal( enemy.position );
        		}
                else
                {
                    //enemy.lastRandomX = Math.random() * 2 - 1;
                    //enemy.lastRandomZ = Math.random() * 2 - 1;
                }
            }
			
        }
        // end enemy move
        
        
        // enemy shoots at player
        
        var cc = getMapSector( cam.position );
		var c = getMapSector( enemy.position );
		if ( Date.now() > enemy.lastShot + 750 && distance(cc.x, cc.z, c.x, c.z) < 2  )
		{
			createBullet( enemy, "enemy" );
			enemy.lastShot = Date.now();
		}
        
        // collision of player with NPC
        
        if ( distance( player.position.x, player.position.z, enemy.position.x, enemy.position.z ) < 20 && !player.dead ) 
        {
            console.log( "player-enemy kollision !!!!!" );
            myhealth -= 1;
            if ( myhealth < 0 ) myhealth = 0;
            $('#healthbar').css( { width: 0.01 * myhealth * WIDTH/2 } );
		}
		
    } // end loop all enemies


    
    // now check player collision with items
        
    playerPos = getMapSector( player.position );
    
    // player collision with health items
    for ( var i = health.length-1; i >= 0; i-- ) 
    {
        item = health[ i ];
        var h = getMapSector( item.position );
     
        if ( level.itemMap[ playerPos.z ] == level.itemMap[ h.z ] && level.itemMap[ playerPos.x ] == level.itemMap[ h.x ] )
        {
            healthPickup.currentTime = 0;
            healthPickup.volume = 0.3;
            healthPickup.play();
            health.splice( i, 1 );
            scene.remove( item );
            myhealth += 10;
            if ( myhealth > 100 ) myhealth = 100;           
            $('#healthbar').css( { width: 0.01 * myhealth * WIDTH/2 } );
        } 
    }

    // player collision with ammunition items
    for ( var i = ammus.length-1; i >= 0; i-- ) 
    {
        item = ammus[ i ];
        var h = getMapSector( item.position );
        if ( level.itemMap[ playerPos.z ] == level.itemMap[ h.z ] && level.itemMap[ playerPos.x ] == level.itemMap[ h.x ] )
        {
            ammuPickup.currentTime = 0;
            ammuPickup.volume = 0.3;
            ammuPickup.play();
            ammus.splice( i, 1 );
            scene.remove( item );
            ammuscore += 10;
            $('#ammo').html( ammuscore );
        } 
    }
    
    // player collision with coin items
    for ( var i = coins.length-1; i >= 0; i-- ) 
    {
        item = coins[ i ];
        var h = getMapSector( item.position );
        if ( level.itemMap[ playerPos.z ] == level.itemMap[ h.z ] && level.itemMap[ playerPos.x ] == level.itemMap[ h.x ] )
        {
            ammuPickup.currentTime = 0;
            ammuPickup.volume = 0.3;
            ammuPickup.play();
            coins.splice( i, 1 );
            scene.remove( item );
            score += 100;
            $('#score').html( score );
        } 
    }


    // collision player with ring 
    
    if ( level.itemMap[ playerPos.z ][ playerPos.x ] == 97 )
    {
	    gameMusic.pause();

        ringPickup.currentTime = 0;
        ringPickup.volume = 0.5;
        ringPickup.play();
        runAnim = false;
        
        LEVEL++;
		console.log("LEVEL = " + LEVEL );

        if ( LEVEL >= levels.length )
        {
        	showGameOverScreen();
        }
		else
		{
			//scene.remove( player );
			//console.log("player deleted!");
			
            runAnim = false;

            $('#message').html( "Level completed!" );
            $('#message').fadeIn( 600 );
            setTimeout( function()
            {
                $('#message').fadeOut( 600 );
                var showlevel = LEVEL+1;
                $('#nextLevel').html( "<br>" + showlevel );
                $('#nextLevel').fadeIn( 600 );
                
                titleMusic.pause();

                levelin.currentTime = 0;
                levelin.volume = 1.0;
                levelin.play();

                setTimeout( nextLevel, 2000 );
            }, 2000 );
		}
    }

	// player is dead
	
	if ( myhealth <= 0 ) 
	{
	    console.log(" numLives == " + numLives );

        // if set true no collison test with NPCs is done:
        player.dead = true; // remember I'm dead, needed for collision of player and NPC
	    
        lives.splice( lives.length, 1 ); // starts counting at 1!
        scene.remove( lives[ numLives - 1 ] );

        myhealth = 100;    // this is spaghetti :)  
        
        gameMusic.pause();
        tweenPlayerDead.start(); // show some nice ending
        
        //console.log("tween.start");
        
        playerDead.currentTime = 0;
        playerDead.volume = 0.5;
        playerDead.play();

//        setTimeout( nextLive, 5000 ); // go on with this nice function
        
        numLives--;
	    
	    // lost all lives -> game is over
	    if ( numLives <= 0 ) 
	    {
	        //scene.remove( player );
            numLives = LIVES;
            setTimeout( showGameOverScreen, 5000 ); // go on with this nice function
	    } 
	    else
	    {
            setTimeout( nextLive, 5000 ); // go on with this nice function
	    }

        // to do 
        // some more nice levels needed here
    }


} // end function render()

// not used but looks promising:
function wait()
{
    //$( "#debug03" ).html( "render runAnim = " + runAnim );
    
    //runAnim = true;
    
    console.log("wait........");
    
    //TWEEN.update();
    
}

function setupScene() {

    var stats = initStats();
    
    var planeGeo = new THREE.PlaneGeometry( (level.mapW-1) * UNITSIZE, (level.mapH-1) * UNITSIZE );
	var planeMesh = new t.Mesh( planeGeo, level.planeMaterial );
    planeMesh.rotateX( -Math.PI / 2 );
    planeMesh.position.y = -15;
    scene.add( planeMesh );

	// mirror
/*
    groundMirror = new THREE.Mirror( renderer, cam, { clipBias: 0.03, textureWidth: WIDTH, textureHeight: HEIGHT, color:0x222288 } );
    var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );

    mirrorMesh.add( groundMirror );
    mirrorMesh.rotateX( - Math.PI / 2 );
    */
//    scene.add( mirrorMesh );

	// Geometry: walls
	//var cube = new t.CubeGeometry( UNITSIZE, WALLHEIGHT, UNITSIZE );
    var cube = new t.CubeGeometry( UNITSIZE, UNITSIZE, UNITSIZE );

    // first remove old wall items from scene

    for ( i = scene.children.length - 1; i >= 0 ; i -- ) 
    {
        item = scene.children[ i ];
        if ( item.isWall )
        {
            scene.remove( item );
        }
    }
	
	world = [];
	
	console.log("mapW = " + level.mapW );
    console.log("mapH = " + level.mapH );

    // build 3D world from map
	for ( var x = 0; x < level.mapW; x++ ) {
		for ( var z = 0; z < level.mapH; z++ ) {
			
			if ( level.map[z][x] > 0 ) 
			{
				var wall = new t.Mesh( cube, level.materials[ level.map[z][x] - 1 ] );
				// in Pixel umrechnen bzw. skalieren
				// Labyrinth von links nach rechts aufbauen
				wall.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
				wall.position.y = WALLHEIGHT / 2;
                //wall.position.y = UNITSIZE;
				// bzw. von vorne nach hinten aufbauen
				wall.position.z = ( z - level.mapH / 2 ) * UNITSIZE;
				wall.isWall = true;
				world.push( wall ); 
				scene.add( wall );
			}
		}
	}
	// to do: put all walls into one mesh
	
}


function setupEnemies() {

    //var aiMaterial2 = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/smiley001.jpg')});
    //var aiMaterial = new t.MeshBasicMaterial({ color: 0xE2cb9b, map: t.ImageUtils.loadTexture('images/smilie002.png')});
    //var aiMaterial = new t.MeshBasicMaterial({ color: 0xE2cb9b, map: t.ImageUtils.loadTexture('images/neon_acid.png')});
    //var aiMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/smiley003.jpg')});
    //var aiMaterial = new t.MeshBasicMaterial({/*color: 0xff0000,*/ map: t.ImageUtils.loadTexture('images/photoshop/player003.jpg') });
    
    //aiMaterial.shading = t.SmoothShading;
    //aiMaterial.wireframe = true;
    
    //aiMaterial.map.wrapS = t.ClampToEdgeWrapping;
    //aiMaterial.map.wrapT = t.ClampToEdgeWrapping;

    //aiMaterial.map.repeat.set( 1.2, 1.2 );
    
    var aiGeo = new t.SphereGeometry( 10, 12, 12 );

    ai = [];
    health = [];
    ammus = [];
    coins = [];
    lives = [];
    
    // first remove old items from scene

    for ( i = scene.children.length - 1; i >= 0 ; i -- ) 
    {
        item = scene.children[ i ];
        if ( item.isItem )
        {
            scene.remove( item );
        }
    }

    console.log("mapW = " + level.mapW );
    console.log("mapH = " + level.mapH );

    // number of lives
    for ( var i = 0; i <= numLives - 1; i++ )
    {
        item = new t.Mesh( playerGeo, playerMaterial );
        item.position.x = -numLives * 20/2 + i * 30;        
        item.position.y = 12;        
        item.position.z = -level.mapH * UNITSIZE + 100;
        lives[ i ] = item;        
        scene.add( item );        
    }

    // set items from itemMap

    for ( var x = 0; x < level.mapW; x++ ) {
        for ( var z = 0; z < level.mapH; z++ ) {
            
            //console.log("map = " + level.itemMap[j][i] );
            
            
            //if ( level.itemMap[j][i] != "" )
            //{
            switch ( level.itemMap[z][x] ) 
            {
                // player
                case 224:
/*                   
                    player = new t.Mesh( playerGeo, playerMaterial );
                    player.position.x = ( i - mapW / 2 ) * UNITSIZE;
                    player.position.z = ( j - mapH / 2 ) * UNITSIZE;
                    player.position.y = 10;
                    player.dead = false;
                    player.isItem = true;
                    scene.add( player );
    initController( player );
*/
                break;
                
                // enemies
                case 99:
                    var item = new t.Mesh( aiGeo, level.aiMaterial );
    
                    // scale from world pixels to map coordinates
                    item.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
                    item.position.y = 0;
                    item.position.z = ( z - level.mapH / 2 ) * UNITSIZE;

                    item.health = 100;
                    item.lastRandomX = 0;//Math.random();
                    item.lastRandomZ = 0;//Math.random();
                    item.lastShot = Date.now();
                    item.isItem = true;
                    
                    //item.rotation.z = Math.PI/2;
                    item.rotation.y = 0;//Math.PI/2;
                    
                    // needed for animation:
                    item.numRadians = 0; // varies depending on phi: phi/item.step
                    item.radiansCounter = 0;
                    item.STEP = 2*Math.PI/180; // rotate 2 degrees each frame, clockwise or counterclockwise depending on phi
                    item.animation = false; // animation is running
                    
                    // should we saved phi here?
                    
                    ai.push( item );
                    scene.add( item );
                break;

                // health
                case 98:
                    var item = new t.Mesh(
                        new t.CubeGeometry(15, 15, 15),
                        new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/health.png')} ));
                    
                    item.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
                    item.position.y = 0;
                    item.position.z = ( z - level.mapH / 2 ) * UNITSIZE;
                    item.rotation.x = Math.random() * 1.001;
                    item.rotation.y = Math.random() * 1.001;
                    item.isItem = true;
                    health.push( item );
                    scene.add( item );
                break;                        
         
                // ring, only 1
                case 97:
                    // gold
                    ring = new THREE.Mesh( new THREE.TorusGeometry( 10, 2, 15, 30 ), new THREE.MeshPhongMaterial( { 
                        color: 0xaa9944, 
                        specular:0xbbaa99,
                        shininess:50,
                        overdraw: true } ) );

                    ring.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
                    ring.position.y = 11;
                    ring.position.z = ( z - level.mapH / 2 ) * UNITSIZE;
                    ring.rotation.x = Math.random() * 1.001;
                    ring.rotation.y = Math.random() * 1.001;
                    ring.isItem = true;
                    scene.add( ring );
                break;
                // ammunition
                case 96:
                    var geometry = new THREE.CylinderGeometry( 2, 6, 10, 13 );
                    var material = new THREE.MeshNormalMaterial();
                    var item = new THREE.Mesh( geometry, material );
                    item.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
                    item.position.y = 0;
                    item.position.z = ( z - level.mapH / 2 ) * UNITSIZE;
                    item.rotation.x = 0; 
                    item.rotation.y = 0;
                    item.isItem = true;
                    ammus.push( item );
                    scene.add( item );
                break;                        
                // coins
                //case 5:
                default:
                    var geometry = new THREE.CylinderGeometry( 6, 6, 2, 18 );
                    //var geometry = new coin();
                    //var material = new THREE.MeshNormalMaterial( { color: 0xffaa00 } );
                    var item = new THREE.Mesh( geometry, level.coinMaterial );
                    item.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
                    item.position.y = 0;
                    item.position.z = ( z - level.mapH / 2 ) * UNITSIZE;
                    item.rotation.x = 0; 
                    item.rotation.y = 0;
                    item.rotation.z = Math.PI/2;
                    item.isItem = true;
                    coins.push( item );
                    scene.add( item );
                break;                        
            }
            //}
        }
    }
}

/*
 * set player position from item map
 * 
 */
function setupPlayer()
{
    for ( var x = 0; x < level.mapW; x++ ) {
        for ( var z = 0; z < level.mapH; z++ ) {
            switch ( level.itemMap[z][x] ) 
            {
                case 94:
                    player = new t.Mesh( playerGeo, playerMaterial );
                    player.position.x = ( x - level.mapW / 2 ) * UNITSIZE;
                    player.position.z = ( z - level.mapH / 2 ) * UNITSIZE;
                    player.position.y = 0;
                    
                    //cam.rotation.y = Math.PI;
                    
                    player.dead = false;
                    player.direction = "";
                    player.isItem = true;
                    scene.add( player );
                break;
            }
        }
    }
    
    cam.position = player.position.clone();
    
        // if player is dead fly him to heaven :)
    tweenPlayerDead = new TWEEN.Tween( player.position )
        .to( { y: 100 }, 8000 )
        //.delay( 25 )
        .easing( TWEEN.Easing.Elastic.InOut )
        .onUpdate( function()
        {
            player.translateY( player.position.y );
        });
 }


function initStats() 
{
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';
    $("#Stats-output").append( stats.domElement );
    return stats;
}

function distance( x1, y1, x2, y2 ) { return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)) };


// v in world pixels
function getMapSector( v ) {
    // calculate position in map
	var x = Math.floor( ( v.x + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2 );
	var z = Math.floor( ( v.z + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2 );
/*	
	// dont know if need this, looks safer :)
	if ( x <= 0 ) x = 1;
	if ( x >= mapW ) x = mapW - 1;
	if ( z <= 0) z = 1;
	if ( z >= mapH ) z = mapH - 1;
*/	
	//return { x: x, z: z };
	return { x: x, z: z };
}

function checkWallCollision3( v ) {
    var c = getMapSector( v );
    return level.map[ c.z ][ c.x ] > 0;
}

/*
 * use raycast method for collision test player - player( nextStep )
 * param v = Vector3(), new position vector of player in object space
 * 
 */
function checkWallCollision( v ) 
{
    var dirvec = new t.Vector3(),
    dirvec = v.sub( player.position ); // where do we look at?
    
    //console.log( "check = " + controller.object.position.x + " *** " + controller.object.position.y + " *** " + controller.object.position.z );

    //debug: helper arrow shows dirvec
    //arrow1.setDirection( dirvec );
    //arrow1.setLength( len );
    
    raycasterPlayer.set( player.position, dirvec.normalize() ); // source, direction, use this ray, see Raycaster.js
    var intersects = raycasterPlayer.intersectObjects( world ); // which objects does ray hit?

    if ( intersects.length > 0 ) // found a hit
    {
        if ( intersects[ 0 ].distance <= 20 ) return true; // this is radius of abjects = 10
    }

    return false; // no collision detected
}

/*
 * collision test cam - cam( nextStep )
 * 
 */

function checkWallCollisionCam( v ) 
{
    var dirvec = new t.Vector3(),
    dirvec = v.sub( cam.position ); // where does cam look at?
    
    //console.log( "check = " + controller.object.position.x + " *** " + controller.object.position.y + " *** " + controller.object.position.z );

    //debug: helper arrow shows dirvec
    //arrow1.setDirection( dirvec );
    //arrow1.setLength( len );
    
    raycasterCam.set( cam.position, dirvec.normalize() ); // source, direction, use this ray, see Raycaster.js
    var intersects = raycasterCam.intersectObjects( world ); // which objects does ray hit?

    if ( intersects.length > 0 ) // found a hit
    {
        
        console.log("intersects == " + intersects.length );

        for ( var i = 0; intersects.length-1; i++ )
        {
            console.log("distance0 == " + intersects[ i ].distance );
            if ( intersects[ i ].distance <= 15 ) return true; // this is radius of abjects = 10
        }
        
    }

    return false; // no collision detected
}


// fucking dammned collision test walls - enemies, hate this :/
/*
 * 
 * v : position vector in object space
 * 
 */
var ik = 10; // radius of enemy sphere in pixel

function checkWallCollisionEnemies2( v ) {
    
    //if ( runAnim == false ) return false;    

    var c = getMapSector( v );
    //console.log( "map = " + map[c.z][c.x] );
    
    if ( level.map[c.z][c.x] > 0 ) return true;
    
    // collision left
    var mapX = Math.floor( ( v.x - ik + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2 );
    var mapZ = Math.floor( ( v.z      + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2 );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= level.mapW ) mapX = level.mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= level.mapH ) mapZ = level.mapH - 1;
/*    
    $( "#debug02" ).html( "mapX = " + mapX );
    $( "#debug03" ).html( "mapZ = " + mapZ );
    $( "#debug04" ).html( "map[ mapZ ][ mapX ] = " + map[ mapZ ][ mapX ] );
*/
    if ( level.map[ mapZ ][ mapX ] > 0 ) return true;

    // collision right
    mapX = Math.floor( ( v.x + ik + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2 );
    mapZ = Math.floor( ( v.z      + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2 );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= level.mapW ) mapX = level.mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= level.mapH ) mapZ = level.mapH - 1;
    if ( level.map[ mapZ ][ mapX ] > 0 ) return true;

    // collision far
    mapX = Math.floor( ( v.x      + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2 );
    mapZ = Math.floor( ( v.z - ik + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2 );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= level.mapW ) mapX = level.mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= level.mapH ) mapZ = level.mapH - 1;
    if ( level.map[ mapZ ][ mapX ] > 0 ) return true;

    // collision near
    mapX = Math.floor( ( v.x      + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2 );
    mapZ = Math.floor( ( v.z + ik + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2 );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= level.mapW ) mapX = level.mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= level.mapH ) mapZ = level.mapH - 1;
    if ( level.map[ mapZ ][ mapX ] > 0 ) return true;
    
    return false;
}


function checkWallCollisionEnemies( v ) {
    
    map = level.map;
    mapW = level.mapW;
    mapH = level.mapH;
    
    //if ( runAnim == false ) return false;    

    var c = getMapSector( v );
    //console.log( "map = " + map[c.z][c.x] );
    
    if ( map[c.z][c.x] > 0 )
    {
		//console.log("kollll");
    	return true;
    }

    // collision left
    var mapX = Math.floor( ( v.x - ik + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2  );
    var mapZ = Math.floor( ( v.z      + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2 );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= mapW ) mapX = mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= mapH ) mapZ = mapH - 1;
/*    
    $( "#debug02" ).html( "mapX = " + mapX );
    $( "#debug03" ).html( "mapZ = " + mapZ );
    $( "#debug04" ).html( "map[ mapZ ][ mapX ] = " + map[ mapZ ][ mapX ] );
*/
	var w = map[ mapZ ][ mapX ];
    if ( map[ mapZ ][ mapX ] > 0 ) 
    {
    	//console.log("collision LINKS!!!" + w );
    	return true;
	}
    // collision right
    mapX = Math.floor( ( v.x + ik + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2  );
    mapZ = Math.floor( ( v.z      + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2  );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= mapW ) mapX = mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= mapH ) mapZ = mapH - 1;

    if ( map[ mapZ ][ mapX ] > 0 ) 
    {
    	//console.log("collision RECHTS!!!");
    	return true;
	}
    // collision far
    mapX = Math.floor( ( v.x      + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2  );
    mapZ = Math.floor( ( v.z - ik + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2  );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= mapW ) mapX = mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= mapH ) mapZ = mapH - 1;
    
    if ( map[ mapZ ][ mapX ] > 0 )
    {
    	//console.log("collision FAR!!!");
    	return true;
	}

    // collision near
    mapX = Math.floor( ( v.x      + UNITSIZE / 2 ) / UNITSIZE + level.mapW / 2  );
    mapZ = Math.floor( ( v.z + ik + UNITSIZE / 2 ) / UNITSIZE + level.mapH / 2  );
    if ( mapX <= 0 ) mapX = 1;
    if ( mapX >= mapW ) mapX = mapW - 1;
    if ( mapZ <= 0 ) mapZ = 1;
    if ( mapZ >= mapH ) mapZ = mapH - 1;
    
    if ( map[ mapZ ][ mapX ] > 0 )
    {
    	//console.log("collision NEAR!!!");
    	return true;
	}

    return false;
}

/*
var file = "images/canvas2d.png";
var img = new Image();
img.src = file;

img.onload = function()
{

}
  */  
    
    
function drawRadar() {
	
	var c = getMapSector( player.position );
	
	var context = document.getElementById('radar').getContext('2d');
    //context.globalAlpha = 0.5;

    //context.drawImage(img, 0, 0);
	
	var w = 10; // width of wall
	
	for ( var x = 0; x < level.mapW; x++ ) {
		for ( var z = 0; z < level.mapH; z++ ) {

            var d = 0; // Anzahl Monster pro Kachel
            
            for ( var k = 0; k < ai.length; k++ ) {
                var e = getMapSector( ai[ k ].position );
                if ( x == e.x && z == e.z ) {
                    d++;
                }
            }
 
            // Player-Position rot
            if ( x == c.x && z == c.z && d == 0 ) {
                context.fillStyle = '#cc0000';
                context.beginPath();
                context.arc( x*w+w/2, z*w+w/2, w/2, 0, 2 * Math.PI, false);
                context.fill();
            }
            
			// Monster steht auf Kachel: gelb
			else if ( d > 0 ) {
				context.fillStyle = '#ffaa00';
                context.beginPath();
                context.arc( x*w+w/2, z*w+w/2, w/2, 0, 2 * Math.PI, false);
                context.fill();
		    }
		    
			// Kachel ist Mauer: blau
			else if ( level.map[z][x] > 0 ) {
				context.fillStyle = '#000000';
                //context.globalAlpha=0.5;
                context.fillRect( x * w, z * w, (x+1)*w, (z+1)*w);
			}
			// Kachel ist freier Gang
			else {
			    //ctx.fillStyle = 'rgba(225,225,225,0.5)';
                //context.fillStyle = 'rgba( 0, 0, 225, 0.1 )';
				
				context.fillStyle = '#770000';
                //context.globalAlpha=1;
                context.fillRect( x * w, z * w, (x+1)*w, (z+1)*w);
			}
		}
	}
}


var bullets = [];
var bulletBlue = new t.MeshBasicMaterial({color: 0x00ffff });
var bulletRed = new t.MeshBasicMaterial({color: 0xef23a1 });
var sphereGeo = new t.SphereGeometry(2, 6, 6);

function createBullet( obj, type ) 
{
// obj = wer schiesst? Who is shooting?

    if ( ammuscore <= 0 ) return; // no more ammunition
    
    // play shot sound
    gunshot.currentTime = 0;
    gunshot.volume = 0.5;
    gunshot.play();

	if ( obj === undefined ) {
		obj = cam;
	}

	var sphere;
	
	// player (cam) is shooting
	// vector = mouse
	// obj = cam
	if ( type == "cam" )
	{
		sphere = new t.Mesh( sphereGeo, bulletRed );
		
		// first person view
	    ammuscore--;
	    if ( ammuscore <= 0 )
	    {
	        ammuscore = 0;    
	    }
	    $('#ammo').html( ammuscore );

		var vector = new t.Vector3( mouse.x, mouse.y, 1 );
	    // http://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects
		projector.unprojectVector( vector, obj ); // obj=cam, changes vector!
		// Kamera guckt direkt auf die Mausposition:
		sphere.ray = new t.Ray( obj.position, vector.sub( obj.position ).normalize() );
	}

	// enemy is shooting
	// playervec = player (or cam)
	// obj = enemy
	else if ( type == "enemy" ) 
	{
		sphere = new t.Mesh( sphereGeo, bulletBlue );

		console.log("enemy shooting!!!!");	

		var playervec = new t.Vector3( 0,0,0 );
		playervec = cam.position.clone();
		sphere.ray = new t.Ray( obj.position, playervec.sub( obj.position ).normalize() );
		
	}
	sphere.position.set( obj.position.x, 0, obj.position.z );
	sphere.owner = obj;
	sphere.type = type; // cam, enemy
	
	bullets.push( sphere );
	scene.add( sphere );
	
	return sphere;
}

/*
function loadImage(path) {
	var image = document.createElement('img');
	var texture = new t.Texture(image, t.UVMapping);
	image.onload = function() { texture.needsUpdate = true; };
	image.src = path;
	return texture;
}
*/

function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x =   (e.clientX / WIDTH)  * 2 - 1;
	mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

// Handle window resizing
$(window).resize(function() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	ASPECT = WIDTH / HEIGHT;
	if (cam) {
		cam.aspect = ASPECT;
		cam.updateProjectionMatrix();
	}
	if (renderer) {
		renderer.setSize(WIDTH, HEIGHT);
	}
	$('#intro, #hurt').css({width: WIDTH, height: HEIGHT,});
    $('#health').css( { left: WIDTH/4 } );
    
    $('#intropic').css( { left: WIDTH/2 - 100 } );
    $('#logo_M').css( { left: WIDTH/2-222+"px" } );
    $('#logo_O').css( { left: WIDTH/2-222+84+"px" } );
    $('#logo_N').css( { left: WIDTH/2-222+84+67+"px" } );
    $('#logo_S').css( { left: WIDTH/2-222+84+67+61+"px" } );
    $('#logo_T').css( { left: WIDTH/2-222+84+67+61+49+"px" } );
    $('#logo_E').css( { left: WIDTH/2-222+84+67+61+49+61+"px" } );
    $('#logo_R').css( { left: WIDTH/2-222+84+67+61+49+61+53+"px" } );

    introCanvas.style.left = WIDTH/2 - INTROWIDTH/2 + "px";
    $('#introtext').css( { left: WIDTH/2 - 180 } );

});

/*
$(window).focus(function() {
	if (controls) controls.freeze = false;
});
$(window).blur(function() {
	if (controls) controls.freeze = true;
});
*/

//Get a random integer between lo and hi, inclusive.
//Assumes lo and hi are integers and lo is lower than hi.
function getRandBetween(lo, hi) {
 return parseInt(Math.floor( Math.random()*(hi-lo+1) )+lo, 10);
}


function keydown( event ) {

    if ( event.altKey ) {

        return;

    }

    //console.log("keydown runAnim = " + runAnim );
    
    //if ( runAnim == false ) return;
    
    //event.preventDefault();

    switch ( event.keyCode ) {

        // 1
        case 49:
            camType = "firstPerson";
            cam.position.y = 0;
        break;
        
        // 2 
        case 50:
            camType = "thirdPerson";
            cam.position.y = 400;
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
        // M togle radar 
        case 77:
            
            if ( radarvisible == true )
            {
                radarvisible = false;
                $('#radar').css( {visibility:"hidden"} );
            }
            else if ( radarvisible == false )
            {
                radarvisible = true;
                $('#radar').css( {visibility: "visible"} );
            }
        break;
        
        break;
        case 16: /* shift */ movementSpeedMultiplier = .1; break;
        // cursor up, w 
        case 38: 
        case 87: 
            moveState.forward = 1; 
			player.direction = "forward";
        break;

        // cursor down, s
        case 40: 
        case 83:
            moveState.back = 1; 
			player.direction = "back";
        break;

        // cursor left, a
        case 37: 
        case 65:
            moveState.left = 1; 
			player.direction = "left";
        break;

        // cursor right, d
        case 39: 
        case 68:
            moveState.right = 1; 
			player.direction = "right";
        break;
    }
};



function keyup( event ) {

    switch( event.keyCode ) {

        case 16: /* shift */ movementSpeedMultiplier = 1; break;
        // 1 
        case 49:
            camType = "firstPerson";
        break;
        // 2 
        case 50:
            camType = "thirdPerson";
        break;

        case 38: moveState.forward = 0; break; // up
        case 87: moveState.forward = 0; break; // w

        case 40: moveState.back = 0; break; // down
        case 83: moveState.back = 0; break; // s

        case 37: moveState.left = 0; break; // left
        case 65: moveState.left = 0; break; // a

        case 39: moveState.right = 0; break; // right
        case 68: moveState.right = 0; break; // d
    }
};
/*
function mousedown( event ) 
{
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

function mouseup( event ) 
{
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
*/

function mousemove( event ) 
{
    mouseX = event.pageX - window.innerWidth / 2;
    mouseY = event.pageY - window.innerHeight / 2;
};

function updateCam( delta ) {

    var moveMult = delta * 200;
	
    if ( moveState.forward == 1 )
    {
        cam.translateZ( -moveMult );
        player.rotation.y = Math.PI/2;
        if ( checkWallCollision3( cam.position ) ) 
        {
         	//console.log("player collision forward");
            cam.translateZ( moveMult );
        }
    }        

    if ( moveState.back == 1 )
    {
        cam.translateZ( moveMult );
        player.rotation.y = 3*Math.PI/2;
        if ( checkWallCollision3( cam.position ) ) 
        {
         	//console.log("player collision back");
            cam.translateZ( -moveMult );
        }
    }        

    if ( moveState.left == 1 )
    {
        cam.translateX( -moveMult );        
        player.rotation.y = Math.PI;
        if ( checkWallCollision3( cam.position ) ) 
        {
            //console.log("player collision left");
			cam.translateX( moveMult );
        }
    }        

    if ( moveState.right == 1 )
    {
        cam.translateX( moveMult );        
        player.rotation.y = 2*Math.PI;
        if ( checkWallCollision3( cam.position ) ) 
        {
			//console.log("player collision right");
            cam.translateX( -moveMult );
        }
    }

    if ( camType == "firstPerson" )
    {
	    // rotate player with mouse
	    var actualLookSpeed = delta * lookSpeed*40;
	    
	    lon += mouseX * actualLookSpeed;  // calculate rotation in degrees
	    lat = Math.max( - 85, Math.min( 85, lat ) );
	
	    phi = ( 90 - lat ) * Math.PI / 180; // calculate radians
	    theta = lon * Math.PI / 180;
	
	    var targetPosition = new t.Vector3();
	    targetPosition.x = cam.position.x + 100 * Math.sin( phi ) * Math.cos( theta );
	    targetPosition.y = cam.position.y + 100 * Math.cos( phi );
	    targetPosition.z = cam.position.z + 100 * Math.sin( phi ) * Math.sin( theta );
	    cam.lookAt( targetPosition );
	    player.position = cam.position.clone(); // needed for collision test
	}    

    if ( camType == "thirdPerson" )
    {
	    // Kamera folgt enemy von oben, für Debug
	    /*
	    var enemy = ai[0];
	    cam.position = enemy.position.clone();
	    cam.position.x = enemy.position.x;
	    cam.position.z = enemy.position.z;
		cam.lookAt( new t.Vector3( enemy.position.x, 0, enemy.position.z ) );`
		*/    
 
 		// Kamera folgt player
	    cam.position.y = 400;
	    player.position.x = cam.position.x;
	    player.position.z = cam.position.z;
		
		// wichtig ist der Richtungswinkel der Kamera ( cam.pos.z - cam.lookAt.pos.z ), sonst ist die Welt um 180 Grad gedreht! 
		cam.lookAt( new t.Vector3( player.position.x, 10, player.position.z-160 ) );    
	}

    
    //groundMirror.render( groundMirror );
    renderer.render( scene, cam ); // Repaint

};


