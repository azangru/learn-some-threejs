import {
  Scene,
  WebGLRenderer,
  Mesh,
	Object3D,
  MeshLambertMaterial,
	MeshPhongMaterial,
  BoxGeometry,
	SphereGeometry,
  CylinderGeometry,
	TorusGeometry,
  Fog,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
	AxesHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

import styles from './styles.module.css';

let cameraControls: OrbitControls;

const state = {
	armY: 70.0,
	armZ: -15.0,

	forearmY: 10.0,
	forearmZ: 60.0
};


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
	camera.position.set(-510, 240, 100);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 120, 0);

	const { scene, forearm, arm } = fillScene();

	setupGui();
  animate({ renderer, scene, forearm, arm, camera });
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

	const robotBaseMaterial = new MeshPhongMaterial({ color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 });
	const robotForearmMaterial = new MeshPhongMaterial({ color: 0xF4C154, specular: 0xF4C154, shininess: 100 });
	const robotUpperArmMaterial = new MeshPhongMaterial({ color: 0x95E4FB, specular: 0x95E4FB, shininess: 100 });
	const robotBodyMaterial = new MeshPhongMaterial({ color: 0x279933, specular: 0x279933, shininess: 100 });

	const torus =  new Mesh(new TorusGeometry( 22, 15, 32, 32 ), robotBaseMaterial );
	torus.rotation.x = 90 * Math.PI/180;
	scene.add( torus );

	const forearm = new Object3D();
	const forearmLength = 80;

	createRobotExtender({forearm, forearmLength, forearmMaterial: robotForearmMaterial});

	const arm = new Object3D();
	const upperArmLength = 120;

	createRobotCrane({arm, upperArmLength, armMaterial: robotUpperArmMaterial});

	// Move the forearm itself to the end of the upper arm.
	forearm.position.y = upperArmLength;
	arm.add(forearm);

	const body = new Object3D();
	const bodyLength = 60;
	createRobotBody({ part: body, length: bodyLength, material: robotBodyMaterial });
	
	arm.position.y = bodyLength;
	body.add(arm);

	scene.add(body);

  return { scene, forearm, arm };
};

const createRobotExtender = (params: {
	forearm: Object3D,
	forearmLength: number,
	forearmMaterial: MeshPhongMaterial
}) => {
	const { forearm, forearmLength, forearmMaterial } = params;
	let cylinder = new Mesh(new CylinderGeometry( 22, 22, 6, 32 ), forearmMaterial);
	forearm.add(cylinder);

	for (let i = 0; i < 4; i++) {
		const box = new Mesh(new BoxGeometry( 4, forearmLength, 4 ), forearmMaterial);
		box.position.x = (i < 2) ? -8 : 8;
		box.position.y = forearmLength / 2;
		box.position.z = (i%2) ? -8 : 8;
		forearm.add(box);
	}

	cylinder = new Mesh(new CylinderGeometry( 15, 15, 40, 32 ), forearmMaterial);
	cylinder.rotation.x = 90 * Math.PI/180;
	cylinder.position.y = forearmLength;
	forearm.add( cylinder );
};

const createRobotCrane = (params: {
	arm: Object3D,
	upperArmLength: number,
	armMaterial: MeshPhongMaterial
}) => {
	const { arm, upperArmLength, armMaterial } = params;

	const box = new Mesh(new BoxGeometry( 18, upperArmLength, 18 ), armMaterial);
	box.position.y = upperArmLength/2;
	arm.add( box );

	var sphere = new Mesh(new SphereGeometry( 20, 32, 16 ), armMaterial);

	// place sphere at end of arm
	sphere.position.y = upperArmLength;
	arm.add( sphere );
};

const createRobotBody = (params: {
	part: Object3D,
	length: number,
	material: MeshPhongMaterial
}) => {
	const { part, length, material } = params;

	let cylinder = new Mesh(new CylinderGeometry(50, 12, length/2, 18), material);
	cylinder.position.y = length/4;
	part.add( cylinder );

	cylinder = new Mesh(new CylinderGeometry( 12, 50, length/2, 18 ), material);
	cylinder.position.y = 3*length/4;
	part.add( cylinder );

	const box = new Mesh(new BoxGeometry( 12, length/4, 110 ), material);
	box.position.y = length/2;
	part.add( box );

	const sphere = new Mesh(new SphereGeometry( 20, 32, 16 ), material);

	// place sphere at end of arm
	sphere.position.y = length;
	part.add( sphere );
};

const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: PerspectiveCamera,
	forearm: Object3D,
	arm: Object3D
}) => {
  const { scene, renderer, camera, forearm,  arm } = params;
  cameraControls.update();

	arm.rotation.y = state.armY * Math.PI/180;	// yaw
	arm.rotation.z = state.armZ * Math.PI/180;	// roll

	forearm.rotation.y = state.forearmY * Math.PI/180;	// yaw
	forearm.rotation.z = state.forearmZ * Math.PI/180;	// roll

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

const setupGui = () => {
	const gui = new GUI();
	gui.add( state, "armY", -180, 180 ).name("Upper arm y");
	gui.add( state, "armZ", -45, 45 ).name("Upper arm z");
	gui.add( state, "forearmY", -180, 180).name("Forearm y");
	gui.add( state, "forearmZ", -120, 120 ).name("Forearm z");
};

export default main;