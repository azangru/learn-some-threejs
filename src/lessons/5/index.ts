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
import { GUI } from 'dat.gui';

import styles from './styles.module.css';

const state = {
  showGridX: false,
  showGridY: false,
  showGridZ: false,
  showAxes: false,
  showGround: true
};

const	effectController = {
  ...state
};

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
	const camera = new PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	camera.position.set( -700, 500, -1600 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	camera.position.set( -480, 659, -619 );
	cameraControls.target.set(4,301,92);

	const scene = fillScene();


  setupGui();
  animate({ renderer, scene, camera });
};

const createDrinkingBird = (scene: Scene) => {
	// MODELS
	// base + legs + feet
	createSupport(scene);

	// body + body/head connector
	createBody(scene);

	// head + hat
	createHead(scene);
};

const createBody = (scene: Scene) => {
	const sphereMaterial = new MeshLambertMaterial({ color: 0xA00000 });
	const cylinderMaterial = new MeshLambertMaterial({ color: 0x0000D0 });

	const body = new Mesh(
		new SphereGeometry( 58, 32, 16 ),
		sphereMaterial
	);

	body.position.x = 0;
	body.position.y = 160; // as per specs in the drawing
	body.position.z = 0;
	scene.add(body);

	const spine = new Mesh(
		new CylinderGeometry( 12, 12, 390, 32 ),
		cylinderMaterial
	);

	spine.position.x = 0;
	spine.position.y = 160 + 390 / 2; // as per specs in the drawing
	spine.position.z = 0;
	scene.add(spine);
};

const createHead = (scene: Scene) => {
	const sphereMaterial = new MeshLambertMaterial({ color: 0xA00000 });
	const cylinderMaterial = new MeshLambertMaterial({ color: 0x0000D0 });

	const head = new Mesh(
		new SphereGeometry( 52, 32, 16 ),
		sphereMaterial
	);

	head.position.x = 0;
	head.position.y = 160 + 390; // as per specs in the drawing
	head.position.z = 0;
	scene.add(head);

	const hatBrim = new Mesh(
		new CylinderGeometry( 71, 71, 10, 32 ),
		cylinderMaterial
	);

	hatBrim.position.x = 0;
	hatBrim.position.y = 160 + 390 + 40; // as per specs in the drawing
	hatBrim.position.z = 0;
	scene.add(hatBrim);

	const hatTop = new Mesh(
		new CylinderGeometry( 40, 40, 70, 32 ),
		cylinderMaterial
	);

	hatTop.position.x = 0;
	hatTop.position.y = 160 + 390 + 40 + 5 + 70 / 2; // as per specs in the drawing
	hatTop.position.z = 0;
	scene.add(hatTop);
};

const createSupport = (scene: Scene) => {
	const material = new MeshLambertMaterial({ color: 0xF07020 });

	// base
	const base = new Mesh(
		new BoxGeometry(20 + 64 + 110, 4, 2 * 77),
		material
	);
	base.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	base.position.y = 4/2;	// half of height
	base.position.z = 0;	// centered at origin
	scene.add(base);

	// left foot
	const leftFoot = new Mesh(
		new BoxGeometry(20 + 64 + 110, 52, 6),
		material
	);
	leftFoot.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	leftFoot.position.y = 52/2;	// half of height
	leftFoot.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(leftFoot);

	// left leg
	const leftLeg = new Mesh(
		new BoxGeometry(64, 334+52, 6),
		material
	);
	leftLeg.position.x = 0;	// centered on origin along X
	leftLeg.position.y = (334+52)/2;
	leftLeg.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(leftLeg);

	// right foot
	const rightFoot = new Mesh(
		new BoxGeometry(20 + 64 + 110, 52, 6),
		material
	);
	rightFoot.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	rightFoot.position.y = 52/2;	// half of height
	rightFoot.position.z = -77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(rightFoot);

	// right leg
	const rightLeg = new Mesh(
		new BoxGeometry(64, 334+52, 6),
		material
	);
	rightLeg.position.x = 0;	// centered on origin along X
	rightLeg.position.y = (334+52)/2;
	rightLeg.position.z = -77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(rightLeg);
};

const fillScene = () => {
	// SCENE
	const scene = new Scene();
	scene.fog = new Fog( 0x808080, 3000, 6000 );

  // LIGHTS
	var ambientLight = new AmbientLight( 0x222222 );
	var light = new DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -400, 200, -300 );

	const axesHelper = new AxesHelper( 250 );
	scene.add( axesHelper );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	createDrinkingBird(scene);
	
  return scene;
};

const render = (params: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera }) => {
  const { renderer, camera } = params;
  let scene = params.scene;
  cameraControls.update();

  if (
    effectController.showGridX !== state.showGridX ||
    effectController.showGridY !== state.showGridY ||
    effectController.showGridZ !== state.showGridZ ||
    effectController.showGround !== state.showGround ||
    effectController.showAxes !== state.showAxes
  ) {
		state.showGridX = effectController.showGridX;
		state.showGridY = effectController.showGridY;
		state.showGridZ = effectController.showGridZ;
		state.showGround = effectController.showGround;
		state.showAxes = effectController.showAxes;

		scene = fillScene();
	}
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


const setupGui = () => {
	var gui = new GUI();
	gui.add(effectController, "showGridX").name("Show XZ grid");
	gui.add( effectController, "showGridY" ).name("Show YZ grid");
	gui.add( effectController, "showGridZ" ).name("Show XY grid");
	gui.add( effectController, "showGround" ).name("Show ground");
	gui.add( effectController, "showAxes" ).name("Show axes");
};

export default main;