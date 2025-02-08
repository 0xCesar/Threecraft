import * as THREE from 'three';
import { Noise } from 'noisejs';
import GUI from 'lil-gui';

const gui = new GUI(); // Créer une interface GUI

const terrainSettings = {
    baseFactor: 10,  // Grandes montagnes
    detailFactor: 5, // Petits reliefs
    microFactor: 2   // Petites irrégularités
};

gui.add(terrainSettings, 'baseFactor', 0, 20).name("Relief Principal");
gui.add(terrainSettings, 'detailFactor', 0, 10).name("Détails Moyens");
gui.add(terrainSettings, 'microFactor', 0, 5).name("Petites Variations");

const noise = new Noise(Math.random());

const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);
// Tableau de cube material
const dirt = textureLoader.load('../../public/dirt.png');
const grassTopside = textureLoader.load("../../public/grasstop.png");
const grassSide = textureLoader.load("../../public/grassside.png");
const text = textureLoader.load("../../public/texturebasic.png");

const CHUNK_SIZE = 16;
const chunkData = new Array(CHUNK_SIZE).fill().map(() =>
  new Array(CHUNK_SIZE).fill().map(() =>
    new Array(CHUNK_SIZE).fill(0)
  )
);

export default function generateChunk(chunkX, chunkY, scene) {
  chunkX *= CHUNK_SIZE;
  chunkY *= CHUNK_SIZE;
  const geometry = new THREE.BoxGeometry(1, 1, 1);



  for (let i = 0; i < CHUNK_SIZE; i++) {
    for (let j = 0; j < CHUNK_SIZE; j++) {
      let worldX = i + chunkX;
      let worldZ = j + chunkY;
     //  let height = Math.floor((noise.perlin2(worldX * 0.5, worldZ * 0.2) + 1) * 8);
     //  let height = Math.floor((noise.perlin3(worldX * 0.1, worldZ * 0.1, 0.5) + 1) * 8);

        let height = getTerrainHeight(worldX, worldZ);
 
    
        for (let h = 0; h <= height; h++) {
 
        chunkData[i][h][j] = 1; 
      }
    }
  }

  for (let i = 0; i < CHUNK_SIZE; i++) {
    for (let j = 0; j < CHUNK_SIZE; j++) {
      for (let h = 0; h < CHUNK_SIZE; h++) {
        if (chunkData[i][h][j] === 1) {
            let materials = new Array(6).fill(null); // On initialise un tableau de 6 faces
        
            if (i === CHUNK_SIZE - 1 || chunkData[i + 1][h][j] === 0) {
                materials[0] = new THREE.MeshBasicMaterial({ map: dirt, side: THREE.DoubleSide }); // (+X)
            }
        
            if (i === 0 || chunkData[i - 1][h][j] === 0) {
                materials[1] = new THREE.MeshBasicMaterial({ map: dirt, side: THREE.DoubleSide }); // (-X)
            }
        
            if (h === CHUNK_SIZE - 1 || chunkData[i][h + 1][j] === 0) {
                materials[2] = new THREE.MeshBasicMaterial({ map: grassTopside, side: THREE.DoubleSide }); // (+Y)
            }
        
            if (h === 0 || chunkData[i][h - 1][j] === 0) {
                materials[3] = new THREE.MeshBasicMaterial({ map: dirt, side: THREE.DoubleSide }); // (-Y)
            }
        
            if (j === CHUNK_SIZE - 1 || chunkData[i][h][j + 1] === 0) {
                materials[4] = new THREE.MeshBasicMaterial({ map: dirt, side: THREE.DoubleSide }); // (+Z)
            }
        
            if (j === 0 || chunkData[i][h][j - 1] === 0) {
                materials[5] = new THREE.MeshBasicMaterial({ map: dirt, side: THREE.DoubleSide }); // (-Z)
            }
        
      
            if (materials.some(m => m !== null)) {
                const cube = new THREE.Mesh(geometry, materials);
                cube.position.set(i + chunkX, h, j + chunkY);
                scene.add(cube);
            }
        }
      }
    }
  }
}

function getTerrainHeight(x, z) {
    let base = noise.perlin2(x  * 0.05, z * 0.05) * terrainSettings.baseFactor;
    let detail = noise.perlin2(x  * 0.2, z * 0.2) * terrainSettings.detailFactor;
    let micro = noise.perlin2(x * 0.5, z * 0.5) * terrainSettings.microFactor;
    let distortion = Math.sin(x * 0.58) * Math.cos(z * 0.1) * 2;
    return Math.floor(base + detail + micro + distortion);
}

export { gui }
