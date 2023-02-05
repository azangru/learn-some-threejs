import {
  Scene,
  WebGLRenderer,
  Mesh,
	Object3D,
  MeshLambertMaterial,
	SphereGeometry,
  CylinderGeometry,
  Fog,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
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
	const camera = new PerspectiveCamera(38, canvasRatio, 1, 10000);
	camera.position.set(-200, 400, 20);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,150,0);

	const { scene} = fillScene();

  animate({ renderer, scene, camera });
};



const fillScene = () => {
	// SCENE
	const scene = new Scene();
	scene.fog = new Fog(0x808080, 2000, 4000);

  // LIGHTS
	const ambientLight = new AmbientLight(0x222222);
	scene.add(ambientLight);
	
	const light = new DirectionalLight(0xFFFFFF, 1.0);
	light.position.set( 200, 400, 500 );
	scene.add(light);

	const light2 = new DirectionalLight(0xFFFFFF, 1.0);
	light2.position.set(-500, 250, -200);
	scene.add(light2);

	const axesHelper = new AxesHelper( 250 );
	scene.add(axesHelper);


	// FLOWER
	const petalMaterial = new MeshLambertMaterial({ color: 0xCC5920 });
	const flowerHeight = 200;
	const petalLength = 120;
	const flower = new Object3D();

	// Rest of the flower
	const stamenMaterial = new MeshLambertMaterial({ color: 0x333310 });
	const stamen = new Mesh(new SphereGeometry( 20, 32, 16 ), stamenMaterial);
	stamen.position.y = flowerHeight;	// move to flower center
	flower.add(stamen);


	/////////
	// YOUR CODE HERE
	// add code here to make 24 petals, radiating around the sphere
	// Just rotates and positions on the cylinder and petals are needed.
	const petalsCount = 24;
	const yRotationStep = 360 / petalsCount; // 15 degrees
	const petalGeometry = new CylinderGeometry(15, 0, petalLength, 32);

	for (let i = 0; i < 24; i++) {
		const petalMesh = new Mesh(petalGeometry, petalMaterial);
		petalMesh.scale.x = 0.25;
		const petal = new Object3D();
		petal.position.y = flowerHeight;
		petal.add(petalMesh);
		petalMesh.position.x = petalLength / 2; // 20 is the radius of the sphere (stamen)
		const yRotationDeg = yRotationStep * i;
		petalMesh.rotation.z = - Math.PI / 2;
		petal.rotation.y = yRotationDeg * Math.PI / 180;
		petal.rotation.z = Math.PI / 180 * 20;
		flower.add(petal);
	}

	const stemMaterial = new MeshLambertMaterial({ color: 0x339424 });
	const stem = new Mesh(new CylinderGeometry(10, 10, flowerHeight, 32), stemMaterial);
	stem.position.y = flowerHeight/2;	// move from ground to stamen
	flower.add(stem);

	scene.add(flower);

  return { scene };
};

const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: PerspectiveCamera
}) => {
  const { scene, renderer, camera} = params;
  cameraControls.update();

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

const animate = (params: Parameters<typeof render>[0]) => {
	const updatedParams = render(params);
	window.requestAnimationFrame(() => animate(updatedParams));
};

export default main;