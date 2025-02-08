import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import generateChunk, { gui } from './map/chunk.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
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
 
/** 
 * 
 *  Génération de map 
 * 
 *  **/
function generateMap(){
  for(let i = -2; i < 3; i++){
    for(let j = -2; j < 3; j++){
      generateChunk(i , j , scene);
    }
  }
}

gui.onChange(() => {
  scene.clear(); 
  generateMap();
});

camera.position.z = 5;
camera.position.y = 20;
const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
  
  controls.update();  
	renderer.render( scene, camera );

}