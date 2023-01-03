// From https://threejs.org/examples/#webgl_geometry_shapes

import {
  Scene,
  ShapeGeometry,
  Shape,
  Mesh,
  MeshPhongMaterial,
  DoubleSide,
} from 'three';

// Notice how the Three.js example (link above) uses the Shape constructor to easily create a square
export const createSquareShape = () => {
  const squareSideLength = 80;
  return new Shape()
	  .moveTo( 0, 0 )
    .lineTo( 0, squareSideLength )
		.lineTo( squareSideLength, squareSideLength )
		.lineTo( squareSideLength, 0 )
		.lineTo( 0, 0 );
};

export const addShape = (params: {
  shape: Shape;
  // extrudeSettings: Record<string, unknown>,
  color: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  scale: number,
  scene: Scene
}) => {
  const { shape, color, x, y, z, rx, ry, rz, scale, scene } = params;
  let geometry = new ShapeGeometry( shape );

  let mesh = new Mesh( geometry, new MeshPhongMaterial( { side: DoubleSide, color: color } ) );
  mesh.position.set( x, y, z - 295 );
  mesh.rotation.set( rx, ry, rz );
  mesh.scale.set( scale, scale, scale );
  scene.add(mesh);
}