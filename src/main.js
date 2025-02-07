import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

function startGame() {
  // Disable Menu View
  document.getElementById('launcher').style.display = "none";
  // Init renderer 

  // Show renderer
  document.body.appendChild( renderer.domElement );
  generateMap();
}

document.getElementById('sgBtn').addEventListener("click", startGame);
// Cube Ref : 
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../public/texturebasic.png');

/** 
 * 
 *  Génération de map 
 * 
 *  **/
const material = new THREE.MeshBasicMaterial( { map: texture } );
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
function generateMap(){
  
 
  genChunk(0,1);
  genChunk(0,0); 
  genChunk(0,-1);

  genChunk(1,1);
  genChunk(1,0); 
  genChunk(1,-1);

  genChunk(-1,1);
  genChunk(-1,0); 
  genChunk(-1,-1);


 // genChunk(0,-1);
 // genChunk(0,0);
 // genChunk(-1,0);
 // genChunk(-1,-1); 
}
// Chunk Gen 


function genChunk(x, y) {
  x = x * 16;
  y = y * 16;
  
  let cube = new THREE.Mesh();
  for(let i = 0; i < 16; i++){
    for(let j = 0; j < 16; j++){
      cube = new THREE.Mesh( geometry, material );
      cube.position.set(i + x, 0, j + y);
      scene.add( cube );    

    }
  
  }
}





//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );


camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
function animate() {

  controls.update();
	renderer.render( scene, camera );

}