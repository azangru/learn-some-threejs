import {
  Scene,
  WebGLRenderer,
  Mesh,
	MeshBasicMaterial,
	BufferGeometry,
	BufferAttribute,
	DoubleSide,
  PerspectiveCamera,
	Vector3,
	AxesHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import styles from './styles.module.css';

let cameraControls: OrbitControls;


const main = () => {
  const canvas = document.createElement('canvas');
  canvas.classList.add(styles.canvas);
  document.body.appendChild(canvas);

  const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();
	const canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor(0xAAAAAA, 1.0);

	// CAMERA
	const camera = new PerspectiveCamera( 55, canvasRatio, 1, 4000 );
	camera.position.set(100, 150, 130);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	const scene = fillScene();

  animate({ renderer, scene, camera });
};


const fillScene = () => {
	// SCENE
	const scene = new Scene();

	// Triangle Mesh
	const material = new MeshBasicMaterial( { vertexColors: true, side: DoubleSide } );
	const geometry = new BufferGeometry();

	const points = [
    new Vector3(100, 0, 0),
    new Vector3( 0, 100, 0 ),
    new Vector3( 0, 0, 100 ),
  ];

	geometry.setFromPoints(points);
	
	const colors =new Uint8Array([
		255, 0, 0,
    0, 255, 0,
    0, 0, 255,
	]);

	// Surprise! Needed to normalize the array below (the third argument — true — for the BufferAttribute)
	// for the proper conversion to GLSL values.
	geometry.setAttribute( 'color', new BufferAttribute( colors, 3, true ) );

	const mesh = new Mesh( geometry, material );
	scene.add(mesh);

	const axesHelper = new AxesHelper( 250 );
	scene.add( axesHelper );
	
  return scene;
};

const render = (params: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera }) => {
  const { renderer, camera } = params;
  let scene = params.scene;
  cameraControls.update();

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
}

const animate = (params: Parameters<typeof render>[0]) => {
	const updatedParams = render(params);
	window.requestAnimationFrame(() => animate(updatedParams));
}

export default main;