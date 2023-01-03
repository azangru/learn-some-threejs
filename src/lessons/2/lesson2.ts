import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Mesh,
  Color,
  BufferGeometry,
  Vector3,
  MeshNormalMaterial
} from 'three';

import styles from './lesson2.module.css';

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

  const squareMesh = createSquareMesh();
  scene.add(squareMesh);

  renderer.render( scene, camera );
};

const createSquareMesh = () => {
  const geometry = new BufferGeometry();

  const points = [
    new Vector3(3, 3, 0), // start at (3, 3)
    new Vector3( 7, 3, 0 ), // go to (3, 7)
    new Vector3( 7, 7, 0 ), // go to (7, 7) — we have our first triangle now

    new Vector3( 3, 7, 0 ), // from (7, 7), move to (3, 7)
    new Vector3(3, 3, 0), // then go to (3, 3)
    new Vector3( 7, 7, 0 ), // finally, go back to (7, 7) to complete the second triangle
  ];
  geometry.setFromPoints(points);
  geometry.computeVertexNormals();

  const material = new MeshNormalMaterial();

	const mesh = new Mesh( geometry, material );

  return mesh;
};

const setupCamera = (canvasRect: { width: number, height: number }) => {
  const { width, height } = canvasRect;

  const camera = new OrthographicCamera(
    width / -100,
    width / 100,
    height / 100,
    height / -100,
    1,
    1000
  );

  const focus = new Vector3(5, 4, 0);
  camera.position.x = focus.x;
  camera.position.y = focus.y;
  camera.position.z = 1;
  camera.lookAt( focus );
  camera.updateProjectionMatrix();

  console.log(camera.zoom);

  return camera;
};

export default main;