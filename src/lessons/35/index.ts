import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Camera,
  AmbientLight,
  DirectionalLight,
  MeshPhongMaterial,
  Mesh,
  CubeTextureLoader,
  type CubeTexture,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';


import styles from './styles.module.css';

let cameraControls: OrbitControls;

const main = async () => {
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
	const camera = new PerspectiveCamera(45, canvasRatio, 100, 20000);
  camera.position.set(0, 0, 246);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
  cameraControls.update();

	const { scene } = await fillScene();

  render({ renderer, scene, camera });

  cameraControls.addEventListener('change', () => {
    render({ renderer, scene, camera });
  });
};

const loadSkyboxTextures = async () => {
  const cubeTextureLoader = new CubeTextureLoader();
  const directoryPath = new URL('./skybox/', import.meta.url).href;

  const filePaths = [
    'px.jpg', 'nx.jpg',
    'py.jpg', 'ny.jpg',
    'pz.jpg', 'nz.jpg',
  ].map(fileName => `${directoryPath}/${fileName}`);

  const loadPromise = new Promise(resolve => {
    cubeTextureLoader.load(filePaths, resolve);
  });

  const texture = await loadPromise as CubeTexture;

  return texture;
};

const fillScene = async () => {
	// SCENE
	const scene = new Scene();

  // LIGHTS
	scene.add(new AmbientLight(0x333333));
	const directionalLight1 = new DirectionalLight(0xFFFFFF, 0.4);
	directionalLight1.position.set(-1300, 700, 1240);
	scene.add(directionalLight1);
	const directionalLight2 = new DirectionalLight(0xFFFFFF, 0.7);
	directionalLight2.position.set(1000, -500, -1200);
	scene.add(directionalLight2);

  // MATERIALS
  const skyboxTexture = await loadSkyboxTextures();

  const teapotMaterial = new MeshPhongMaterial({
    color: 0x770000,
    specular: 0xffaaaa,
    envMap: skyboxTexture
  });

  const teapotGeometry = new TeapotGeometry();

  const teapot = new Mesh(teapotGeometry, teapotMaterial);

	scene.add(teapot);

  scene.background = skyboxTexture;

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