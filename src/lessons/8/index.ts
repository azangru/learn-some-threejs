import {
  Scene,
  WebGLRenderer,
  Mesh,
	MeshPhongMaterial,
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
	const camera = new PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	camera.position.set( -700, 500, -1600 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	camera.position.set( -480, 659, -619 );
	cameraControls.target.set(4,301,92);

	const scene = fillScene();

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
	const innerBodyMaterial = new MeshPhongMaterial();
	const glassMaterial = new MeshPhongMaterial({ color: 0x0 });

	innerBodyMaterial.shininess = 100;
	innerBodyMaterial.color.setRGB(31/255, 86/255, 169/255);
	innerBodyMaterial.specular.setRGB(0.5, 0.5, 0.5);

	glassMaterial.shininess = 100;
	glassMaterial.opacity = 0.3;
	glassMaterial.transparent = true;

	const bodyWater = new Mesh(
		new SphereGeometry( 104/2, 32, 16, 0, Math.PI * 2, Math.PI/2, Math.PI ),
		innerBodyMaterial
	);

	bodyWater.position.x = 0;
	bodyWater.position.y = 160;
	bodyWater.position.z = 0;
	scene.add(bodyWater);

	const waterMeniscus = new Mesh(
		new CylinderGeometry( 104/2, 104/2, 0, 32 ),
		innerBodyMaterial
	);

	waterMeniscus.position.x = 0;
	waterMeniscus.position.y = 160; // as per specs in the drawing
	waterMeniscus.position.z = 0;
	scene.add(waterMeniscus);

	const glassBody = new Mesh(
		new SphereGeometry( 58, 32, 16 ),
		glassMaterial
	);
	glassBody.position.x = 0;
	glassBody.position.y = 160;
	glassBody.position.z = 0;
	scene.add(glassBody);

	const innerStem = new Mesh(
		new CylinderGeometry( 12/2, 12/2, 390 - 100, 32 ),
		innerBodyMaterial
	);

	innerStem.position.x = 0;
	innerStem.position.y = 160 + 390 / 2 - 100;
	innerStem.position.z = 0;
	scene.add(innerStem);

	const glassStem = new Mesh(
		new CylinderGeometry( 24/2, 24/2, 390, 32 ),
		glassMaterial
	);

	glassStem.position.x = 0;
	glassStem.position.y = 160 + 390/2;
	glassStem.position.z = 0;
	scene.add( glassStem );
};

const createHead = (scene: Scene) => {
	const sphereMaterial = new MeshLambertMaterial();
	const cylinderMaterial = new MeshPhongMaterial();

	sphereMaterial.color.r = 104/255;
	sphereMaterial.color.g = 1/255;
	sphereMaterial.color.b = 5/255;

	cylinderMaterial.color.r = 24/255;
	cylinderMaterial.color.g = 38/255;
	cylinderMaterial.color.b = 77/255;

	cylinderMaterial.shininess = 100;
	cylinderMaterial.specular.setRGB(0.5, 0.5, 0.5);

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
	const legMaterial = new MeshPhongMaterial( { shininess: 4 } );
	legMaterial.color.setHex( 0xAdA79b );
	legMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

	const footMaterial = new MeshPhongMaterial( { color: 0x960f0b, shininess: 30 } );
	footMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

	const bevelRadius = 1.9;

	// base
	const base = new Mesh(
		new BoxGeometry(20 + 64 + 110, 4, 2 * 77),
		footMaterial
	);
	base.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	base.position.y = 4/2;	// half of height
	base.position.z = 0;	// centered at origin
	scene.add(base);

	// left foot
	const leftFoot = new Mesh(
		new BoxGeometry(20 + 64 + 110, 52, 6),
		footMaterial
	);
	leftFoot.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	leftFoot.position.y = 52/2;	// half of height
	leftFoot.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(leftFoot);

	// left leg
	const leftLeg = new Mesh(
		new BoxGeometry(64, 334+52, 6),
		legMaterial
	);
	leftLeg.position.x = 0;	// centered on origin along X
	leftLeg.position.y = (334+52)/2;
	leftLeg.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(leftLeg);

	// right foot
	const rightFoot = new Mesh(
		new BoxGeometry(20 + 64 + 110, 52, 6),
		footMaterial
	);
	rightFoot.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	rightFoot.position.y = 52/2;	// half of height
	rightFoot.position.z = -77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add(rightFoot);

	// right leg
	const rightLeg = new Mesh(
		new BoxGeometry(64, 334+52, 6),
		legMaterial
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
	var light = new DirectionalLight(0xFFFFFF, 0.7);
	light.position.set( 200, 500, 500 );
	scene.add(light);

	var light2 = new DirectionalLight( 0xFFFFFF, 0.9 );
	light2.position.set(-200, -100, -400);
	scene.add(light2);

	const axesHelper = new AxesHelper( 250 );
	scene.add( axesHelper );

	createDrinkingBird(scene);
	
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