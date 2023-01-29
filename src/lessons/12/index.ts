import {
  Scene,
  WebGLRenderer,
  Mesh,
	Object3D,
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
	camera.position.set( -420, 400, 100 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

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
	light.position.set( 200, 400, 500 );
	scene.add(light);

	const light2 = new DirectionalLight(0xFFFFFF, 1.0);
	light2.position.set(-500, 250, -200);
	scene.add(light2);

	const axesHelper = new AxesHelper( 250 );
	scene.add(axesHelper);


	const faceMaterial = new MeshLambertMaterial({ color: 0xFFECA9 });
	const markMaterial = new MeshLambertMaterial({ color: 0x89581F });
	const mark12Material = new MeshLambertMaterial({ color: 0xE6880E });
	const minuteHandMaterial = new MeshLambertMaterial({ color: 0x226894 });
	const hourHandMaterial = new MeshLambertMaterial({ color: 0xE02BFB });

	// clock
	const clock = new Mesh(
		new CylinderGeometry(75, 75, 10, 32), faceMaterial);
	clock.position.y = 5;
	scene.add(clock);

	// marks
	let mark
	mark = new Mesh(new BoxGeometry(20, 4, 15), mark12Material);
	mark.position.x = 60;
	mark.position.y = 9;
	scene.add(mark);

	mark = new Mesh(new BoxGeometry(10, 4, 10), markMaterial);
	mark.position.x = -60;
	mark.position.y = 9;
	scene.add(mark);

	mark = new Mesh(new BoxGeometry(10, 4, 10), markMaterial);
	mark.position.z = 60;
	mark.position.y = 9;
	scene.add(mark);

	mark = new Mesh(new BoxGeometry(10, 4, 10), markMaterial);
	mark.position.z = -60;
	mark.position.y = 9;
	scene.add(mark);

  // YOUR CODE HERE:
  // The dimensions and rotation angles of the hands are correct
  // you just have find a way to perform them in the correct order
	const block = new Mesh(new BoxGeometry(70, 4, 4), minuteHandMaterial);
	block.position.y = 14;
	block.position.x = 70/2 - 10;

	const minuteHand = new Object3D();
	minuteHand.add(block);
	minuteHand.rotation.y = -60 * Math.PI/180;
	scene.add(minuteHand);

	const sphere = new Mesh(new SphereGeometry( 0.5, 32, 16 ), hourHandMaterial);
	sphere.position.y = 18;	// move the hand above the other hand
	sphere.position.x = 50/2 - 10;
	sphere.scale.x = 50;
	sphere.scale.y = 4;
	sphere.scale.z = 4;


	const hourHand = new Object3D();
	hourHand.add(sphere);
	hourHand.rotation.y = 30 * Math.PI/180;

	scene.add(hourHand);

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