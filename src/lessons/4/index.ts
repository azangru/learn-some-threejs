import {
  Scene,
  WebGLRenderer,
  Mesh,
  MeshLambertMaterial,
  BoxGeometry,
  CylinderGeometry,
  Fog,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

import * as Coordinates from './coordinates';

import styles from './lesson4.module.css';


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
	cameraControls.target.set(0,600,0);

	const scene = fillScene();


  setupGui();
  animate({ renderer, scene, camera });
};

const createStairs = (scene: Scene) => {
  const stepMaterialVertical = new MeshLambertMaterial({
		color: 0xA85F35
	});
	const stepMaterialHorizontal = new MeshLambertMaterial({
		color: 0xBC7349
	});

	const stepWidth = 500;
	const stepSize = 200;
	const stepThickness = 50;
	// height from top of one step to bottom of next step up
	const verticalStepHeight = stepSize;
	const horizontalStepDepth = stepSize * 2;

	const stepHalfThickness = stepThickness / 2;

  // +Y direction is up
	// Define the two pieces of the step, vertical and horizontal
	// THREE.CubeGeometry takes (width, height, depth)
	const stepVertical = new BoxGeometry(stepWidth, verticalStepHeight, stepThickness);
	const stepHorizontal = new BoxGeometry(stepWidth, stepThickness, horizontalStepDepth);
	let stepMesh;

  // Make and position the vertical part of the step
	stepMesh = new Mesh( stepVertical, stepMaterialVertical );
	// The position is where the center of the block will be put.
	// You can define position as THREE.Vector3(x, y, z) or in the following way:
	stepMesh.position.x = 0;			// centered at origin
	stepMesh.position.y = verticalStepHeight/2;	// half of height: put it above ground plane
	stepMesh.position.z = 0;			// centered at origin
	scene.add( stepMesh );

	// Make and position the horizontal part
	stepMesh = new Mesh( stepHorizontal, stepMaterialHorizontal );
	stepMesh.position.x = 0;
	// Push up by half of horizontal step's height, plus vertical step's height
	stepMesh.position.y = stepThickness/2 + verticalStepHeight;
	// Push step forward by half the depth, minus half the vertical step's thickness
	stepMesh.position.z = horizontalStepDepth/2 - stepHalfThickness;
	scene.add( stepMesh );
};


const createCup = (scene: Scene) => {
	var cupMaterial = new MeshLambertMaterial({ color: 0xFDD017});
	// THREE.CylinderGeometry takes (radiusTop, radiusBottom, height, segmentsRadius)
	var cupGeo = new CylinderGeometry( 200, 50, 400, 32 );
	var cup = new Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1725;
	cup.position.z = 1925;
	scene.add( cup );
	cupGeo = new CylinderGeometry( 100, 100, 50, 32 );
	cup = new Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1525;
	cup.position.z = 1925;
	scene.add( cup );
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

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	if (state.showGround) {
		Coordinates.drawGround({scene, size: 1000});
	}
	if (state.showGridX) {
		Coordinates.drawGrid({scene, size: 1000, scale: 0.01});
	}
	if (state.showGridY) {
		Coordinates.drawGrid({ scene, size: 1000, scale: 0.01, orientation:"y" });
	}
	if (state.showGridZ) {
		Coordinates.drawGrid({scene, size:1000, scale:0.01, orientation:"z"});
	}
	if (state.showAxes) {
		Coordinates.drawAllAxes({ scene, axisLength:300, axisRadius:2, axisTess:50 });
	}

  createCup(scene);
	createStairs(scene);
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