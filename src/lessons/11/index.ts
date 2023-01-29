import {
  Scene,
  WebGLRenderer,
  Mesh,
  MeshLambertMaterial,
  BoxGeometry,
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

// TODO: clock exercise later

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
	const camera = new PerspectiveCamera( 30, canvasRatio, 1, 10000 );
	camera.position.set(-120, 66, 23);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 43, -8);

	const scene = fillScene();

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
	light.position.set(200, 400, 500);
	scene.add(light);

	const light2 = new DirectionalLight(0xFFFFFF, 1.0);
	light2.position.set(-500, 250, -200);
	scene.add(light2);

	const axesHelper = new AxesHelper(250);
	scene.add(axesHelper);

	const snowMaterial = new MeshLambertMaterial({ color: 0xFFFFFF });
	const woodMaterial = new MeshLambertMaterial({ color: 0x75691B });

	const bottomSnowball = new Mesh(new SphereGeometry(20, 32, 16), snowMaterial);
	bottomSnowball.position.y = 20;	// move the hand above the other hand
	scene.add(bottomSnowball);

	const middleSnowball = new Mesh(new SphereGeometry(15, 32, 16), snowMaterial);
	middleSnowball.position.y = 50;	// move the hand above the other hand
	scene.add(middleSnowball);

	const topSnowball = new Mesh(new SphereGeometry(10, 32, 16), snowMaterial);
	topSnowball.position.y = 70;	// move the hand above the other hand
	scene.add(topSnowball);

	const stick = new Mesh(new CylinderGeometry(2, 2, 60, 32), woodMaterial);
	stick.rotation.x = Math.PI / 2;
	stick.position.x = middleSnowball.position.x;
	stick.position.y = middleSnowball.position.y;
	stick.position.z = middleSnowball.position.z;
	scene.add(stick);

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