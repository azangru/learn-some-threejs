import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  PlaneGeometry,
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  AxesHelper,
  Camera,
  CameraHelper,
  MeshLambertMaterial,
  MeshStandardMaterial,
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
	renderer.setClearColor(0x0, 1.0);
  renderer.shadowMap.enabled = true;

	// CAMERA
	const camera = new PerspectiveCamera(40, canvasRatio, 1, 10000);
  camera.position.set(320,150,50);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(20,20,20);
  cameraControls.update();

	const { scene } = fillScene();

  render({ renderer, scene, camera });

  cameraControls.addEventListener('change', () => {
    render({ renderer, scene, camera });
  });
};

const fillScene = () => {
	// SCENE
	const scene = new Scene();

  const axesHelper = new AxesHelper( 250 );
	scene.add(axesHelper);

  // LIGHTS
	scene.add(new AmbientLight(0x222222));

  const directionalLight = new DirectionalLight('burlywood', 3);
  directionalLight.position.set(80, 100, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const directionalLightHelper = new DirectionalLightHelper(directionalLight);
  scene.add(directionalLightHelper);

  const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
  scene.add(directionalLightCameraHelper);
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -200;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 160;
  console.log(directionalLight.shadow.camera);

  const boxGeometry = new BoxGeometry(50, 50, 50);
  const boxMaterial = new MeshStandardMaterial({ color: 'red' });
  const box = new Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;
  box.position.y = 50 / 2;
  scene.add(box);

  directionalLight.target = box;

  const groundGeometry = new PlaneGeometry(1000, 1000);
  const groundMaterial = new MeshLambertMaterial({ color: 'white' });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.receiveShadow = true;
  ground.rotateX(-Math.PI / 2);
  scene.add(ground)

  return { scene };
};

const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: Camera
}) => {
  const { scene, renderer, camera} = params;

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

export default main;