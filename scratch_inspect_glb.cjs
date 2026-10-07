const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'public', 'heart.glb');
const buffer = fs.readFileSync(glbPath);

// Parse GLB Header
const magic = buffer.readUInt32LE(0);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.readUInt32LE(16);
const jsonData = buffer.subarray(20, 20 + jsonChunkLength).toString('utf8');

const gltf = JSON.parse(jsonData);

console.log('=== GLTF NODES ===');
gltf.nodes.forEach((node, i) => {
  console.log(`Node ${i}: name="${node.name}", mesh=${node.mesh}`);
});

console.log('\n=== GLTF MESHES ===');
gltf.meshes.forEach((mesh, i) => {
  console.log(`Mesh ${i}: name="${mesh.name}"`);
  mesh.primitives.forEach((prim, pi) => {
    console.log(`  Primitive ${pi}: material=${prim.material}`);
  });
});

console.log('\n=== GLTF MATERIALS ===');
if (gltf.materials) {
  gltf.materials.forEach((mat, i) => {
    console.log(`Material ${i}: name="${mat.name}"`);
  });
}
