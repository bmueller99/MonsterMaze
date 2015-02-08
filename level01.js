

// Level 01


function level01()
{
	// maps:
	
	/*
	 * walls: 1
	 * walkable (empty): 0
	 * 
	 */
	
	this.map = [ // 1  2  3  4  5  6  7  8  9
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 
	           [1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1,], // 0
	           [1,  , 1,  , 1, 1,  ,  ,  ,  ,  ,  , 1,], // 1
	           [1,  , 1,  ,  , 1,  , 1,  ,  ,  ,  , 1,], // 2
	           [1,  ,  ,  ,  , 1,  , 1, 1,  , 1, 1, 1,], // 3
	           [1,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  , 1,], // 4
	           [1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1,], // 5
	           [1,  , 1,  ,  , 1,  , 1, 1,  , 1, 1, 1,], // 6
	           [1,  , 1, 1, 1, 1,  , 1,  ,  ,  ,  , 1,], // 7
	           [1,  ,  ,  ,  ,  ,  , 1,  ,  ,  ,  , 1,], // 8
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
	           ];
	           
	 this.mapH = this.map.length;
	 this.mapW = this.map[0].length;
	
	/* item map
     * 
     * enemies: 99
     * health: 98
     * ring: 97
     * ammunition : 96
     * coins: default ("")
     * player: 94
	 * 
	 */
	this.itemMap = 
	       [ // 1  2  3  4  5  6  7  8  9  10 11 12 13
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 
	           [1,  ,  ,  ,  ,99,  ,  ,  ,96,96,96, 1,], // 0
	           [1,  , 1,  , 1, 1,99,  ,  ,  ,  ,  , 1,], // 1
	           [1,  , 1,  ,  , 1,99, 1,  ,  ,  ,99, 1,], // 2
	           [1,  ,  ,  ,98, 1,99, 1, 1,  , 1, 1, 1,], // 3
	           [1,  , 1,  ,98, 1,99,  ,  ,  ,99,  , 1,], // 4
	           [1,  ,  ,  ,98, 1,99,  ,  ,  ,  ,  , 1,], // 5
	           [1,  , 1,  ,  , 1,99, 1, 1,  , 1, 1, 1,], // 6
	           [1,  , 1, 1, 1, 1,  , 1,  ,94,  ,97, 1,], // 7
	           [1,  ,  ,96,96,96,  , 1,98,98,98,98, 1,], // 8
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
	           ];
	
	this.itemMapTest = [ // 1  2  3  4  5  6  7  8  9
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 0
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 1
	           [1, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 2
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 3
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 4
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 5
	           [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 6
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1,], // 7
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1,], // 8
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
	           ];


    // plane material 

    this.mat1Texture = t.ImageUtils.loadTexture('images/wall_5.png');
    this.mat1Texture.wrapS = this.mat1Texture.wrapT = THREE.RepeatWrapping;
    this.mat1Texture.repeat.set( 3.0, 3.0 );
    this.mat1Texture.needsUpdate = true;
    this.planeMaterial = new t.MeshBasicMaterial({/*color: 0xff0000,*/ map: this.mat1Texture }  );

	// enemy material 
	this.aiMaterial = new t.MeshBasicMaterial({/*color: 0xff0000,*/ map: t.ImageUtils.loadTexture('images/photoshop/player003.jpg') });
	
	// wall material
    this.materials = [
                     //new t.MeshLambertMaterial( {/*color: 0x00CCAA,*/map: t.ImageUtils.loadTexture('images/wall-1.jpg')} ),
                     new t.MeshLambertMaterial( {/*color: 0x00CCAA,*/map: t.ImageUtils.loadTexture('images/evil5.jpg')} )
                     
                     //new t.MeshLambertMaterial( {/*color: 0xC5EDA0,*/map: t.ImageUtils.loadTexture('images/176.jpg')} ),
                     //new t.MeshLambertMaterial( {/*color: 0xC5EDA0,*/map: t.ImageUtils.loadTexture('images/neon_acid.jpg')} ),
                     
                     //new t.MeshLambertMaterial( {color: 0xFBEBCD} ), // nicht benutzt
                     ];


	// material of coins
    //this.coinMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/smiley001.jpg')});
    this.coinMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/weitere/goldmark.jpg')});

}



