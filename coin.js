

function coin()
{
    var coin_sides_geo = new THREE.CylinderGeometry( 10.0, 10.0, 1.0, 100.0, 10.0, true );
    var coin_cap_geo = new THREE.Geometry();
    
    var r = 10.0;
    for (var i=0; i<30; i++) 
    {
      var a = i * 1/30 * Math.PI * 2;
      var z = Math.sin(a);
      var x = Math.cos(a);
      var a1 = (i+1) * 1/30 * Math.PI * 2;
      var z1 = Math.sin(a1);
      var x1 = Math.cos(a1);
      coin_cap_geo.vertices.push(
        new THREE.Vertex(new THREE.Vector3(0, 0, 0)),
        new THREE.Vertex(new THREE.Vector3(x*r, 0, z*r)),
        new THREE.Vertex(new THREE.Vector3(x1*r, 0, z1*r))
      );
      coin_cap_geo.faceVertexUvs[0].push([
        new THREE.UV(0.5, 0.5),
        new THREE.UV(x/2+0.5, z/2+0.5),
        new THREE.UV(x1/2+0.5, z1/2+0.5)
      ]);
      coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
    }
    coin_cap_geo.computeCentroids();
    coin_cap_geo.computeFaceNormals();
    
    //var coin_sides_texture = THREE.ImageUtils.loadTexture("images/weitere/goldmark.jpg");
    //var coin_cap_texture = THREE.ImageUtils.loadTexture(  "images/weitere/goldmark.jpg");

    var coin_sides_texture = THREE.ImageUtils.loadTexture("images/wall_5.png");
    var coin_cap_texture = THREE.ImageUtils.loadTexture(  "images/wall_5.png");
    
    var coin_sides_mat = new THREE.MeshLambertMaterial({map:coin_sides_texture});
    var coin_sides = new THREE.Mesh( coin_sides_geo, coin_sides_mat );
    
    var coin_cap_mat = new THREE.MeshLambertMaterial({map:coin_cap_texture});
    var coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
    var coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
    
    coin_cap_top.position.y = 0.5;
    coin_cap_bottom.position.y = -0.5;
    coin_cap_top.rotation.x = Math.PI;
    
    var coin2 = new THREE.Object3D();
    coin2.add(coin_sides);
    coin2.add(coin_cap_top);
    coin2.add(coin_cap_bottom);
    
    return coin2;
    //return 12;
    
    
}
