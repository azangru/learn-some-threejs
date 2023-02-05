import {
  Scene,
  WebGLRenderer,
	Vector3,
  Mesh,
	MeshPhongMaterial,
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
	camera.position.set( -7, 7, 2 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

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

	const cylinderMaterial = new MeshPhongMaterial({ color: 0xD1F5FD, specular: 0xD1F5FD, shininess: 100 });

	// get two diagonally-opposite corners of the cube and compute the
	// cylinder axis direction and length
	const maxCorner = new Vector3(1, 1, 1);
	const minCorner = new Vector3(-1,-1,-1);

	const cylAxis = new Vector3().subVectors( maxCorner, minCorner );
	const cylLength = cylAxis.length();

	// take dot product of cylAxis and up vector to get cosine of angle
	cylAxis.normalize();
	const theta = Math.acos( cylAxis.dot( new Vector3(0,1,0) ) ); // or just simply theta = Math.acos( cylAxis.y );

	// YOUR CODE HERE
	const cylinderGeometry = new CylinderGeometry(0.2, 0.2, cylLength, 32);

	const cylinder1 = createRotatedCylinder({
		geometry: cylinderGeometry,
		material: cylinderMaterial,
		rotationAxis: new Vector3(1,0,-1),
		theta
	});
	scene.add(cylinder1);

	const cylinder2 = createRotatedCylinder({
		geometry: cylinderGeometry,
		material: cylinderMaterial,
		rotationAxis: new Vector3(-1,0,-1),
		theta
	});
	scene.add(cylinder2);

	const cylinder3 = createRotatedCylinder({
		geometry: cylinderGeometry,
		material: cylinderMaterial,
		rotationAxis: new Vector3(-1,0,1),
		theta
	});
	scene.add(cylinder3);

	const cylinder4 = createRotatedCylinder({
		geometry: cylinderGeometry,
		material: cylinderMaterial,
		rotationAxis: new Vector3(1,0,1),
		theta
	});
	scene.add(cylinder4);


	// cylinder.clone

  return { scene };
};

const createRotatedCylinder = (params: {
	geometry: CylinderGeometry;
	material: MeshPhongMaterial;
	rotationAxis: Vector3;
	theta: number;
}) => {
	const { geometry, material, rotationAxis, theta } = params;
	const cylinder = new Mesh(geometry, material);
	rotationAxis.normalize();
	cylinder.matrixAutoUpdate = false;
	cylinder.matrix.makeRotationAxis(rotationAxis, theta);
	return cylinder;
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