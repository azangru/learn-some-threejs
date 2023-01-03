import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Mesh,
  Color,
  BufferGeometry,
  Vector3,
  MeshBasicMaterial
} from 'three';

import styles from './lesson3.module.css';

const main = () => {
  const canvas = document.createElement('canvas');
  canvas.classList.add(styles.canvas);
  document.body.appendChild(canvas);

  renderScene(canvas);
};

const renderScene = (canvas: HTMLCanvasElement) => {
  const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

  const scene = new Scene();
  scene.background = new Color( 0xf0f0f0 );

  const camera = setupCamera({ width: canvasWidth, height: canvasHeight });
  
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize( canvasWidth, canvasHeight );

  const polygonMesh = createPolygonMesh(5, 2, { x: -2, y: 0 });
  const polygonDonutMesh = createDonutPolygonMesh(5, 1, { x: 2, y: 0 });
  
  scene.add(polygonMesh);
  scene.add(polygonDonutMesh);

  renderer.render( scene, camera );
};


const createPolygonMesh = (sides: number, radius: number = 1, location: { x: number, y: number } = { x: 0, y: 0 }) => {
	const geometry = new BufferGeometry();

  const points: { x: number, y: number }[] = [];
  let vertices: Vector3[] = [];

	// generate vertices
	for (let p = 0; p < sides; p++ ) {
		// Add 90 degrees so we start at +Y axis, rotate COUNTERCLOCKWISE around
		let angle = (Math.PI/2) + (p / sides) * 2 * Math.PI;
		let x = radius * Math.cos(angle) + location.x;
		let y = radius * Math.sin(angle) + location.y;

    const point = {x, y};
    points.push(point);
	}

  for (let i = 1; i < points.length - 1; i++) {
    const point1 = points[i];
    const point2 = points[i + 1];
    const point3 = points[0];
    const v1 = new Vector3(point1.x, point1.y, 0);
    const v2 = new Vector3(point2.x, point2.y, 0);
    const v3 = new Vector3(point3.x, point3.y, 0);
    vertices = vertices.concat([v1, v2, v3]);
  }

  geometry.setFromPoints(vertices);

  const material = new MeshBasicMaterial( { color: 0xff0000 } );
  const mesh = new Mesh( geometry, material );

  return mesh;
};

// THIS shape contains an incorrect cycle that I initially wrote; but produces an interesting effect — a polygon with a polygon-shaped hole
const createDonutPolygonMesh = (sides: number, radius: number = 1, location: { x: number, y: number } = { x: 0, y: 0 }) => {
  const geometry = new BufferGeometry();

  const points: { x: number, y: number }[] = [];
  let vertices: Vector3[] = [];

	// generate vertices
	for (let p = 0; p < sides; p++ ) {
		// Add 90 degrees so we start at +Y axis, rotate COUNTERCLOCKWISE around
		let angle = (Math.PI/2) + (p / sides) * 2 * Math.PI;
		let x = radius * Math.cos(angle) + location.x;
		let y = radius * Math.sin(angle) + location.y;

    const point = {x, y};
    points.push(point);
	}
  for (let i = 0; i < points.length; i++) {
    const point1 = points[i];
    const point2 = points.at(i - 1) as { x: number, y: number };
    const point3 = points.at(i - 2) as { x: number, y: number };
    const v1 = new Vector3(point1.x, point1.y, 0);
    const v2 = new Vector3(point2.x, point2.y, 0);
    const v3 = new Vector3(point3.x, point3.y, 0);
    vertices = vertices.concat([v1, v2, v3].reverse());
  }

  geometry.setFromPoints(vertices);

  const material = new MeshBasicMaterial( { color: 0x0000ff } );
  const mesh = new Mesh( geometry, material );

  return mesh;
}

const setupCamera = (canvasRect: { width: number, height: number }) => {
  const { width, height } = canvasRect;

  const camera = new OrthographicCamera(
    width / -250,
    width / 250,
    height / 250,
    height / -250,
    1,
    1000
  );

  const focus = new Vector3(0.5, 0, 0);
  camera.position.x = focus.x;
  camera.position.y = focus.y;
  camera.position.z = 1;
  camera.lookAt( focus );
  camera.updateProjectionMatrix();

  return camera;
};

export default main;