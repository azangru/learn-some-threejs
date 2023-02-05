import {
  Scene,
  WebGLRenderer,
	Vector3,
  Mesh,
	Matrix4,
  MeshLambertMaterial,
  CylinderGeometry,
	SphereGeometry,
  Fog,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
	AxesHelper,
	Group,
	type Material
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
	const camera = new PerspectiveCamera(40, canvasRatio, 1, 10000);
	camera.position.set(-528, 513, 92);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,200,0);

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

	// TEST MATERIALS AND OBJECTS
	const redMaterial = new MeshLambertMaterial({ color: 0xFF0000 });
	const greenMaterial = new MeshLambertMaterial({ color: 0x00FF00 });
	const blueMaterial = new MeshLambertMaterial({ color: 0x0000FF });
	const grayMaterial = new MeshLambertMaterial({ color: 0x808080 });

	const yellowMaterial = new MeshLambertMaterial({ color: 0xFFFF00 });
	const cyanMaterial = new MeshLambertMaterial({ color: 0x00FFFF });
	const magentaMaterial = new MeshLambertMaterial({ color: 0xFF00FF });

	const radius = 20;
	const segmentsWidth = 32;
	
	let capsule;

	// along Y axis
	capsule = createCapsule({
		material: greenMaterial,
		radius,
		top: new Vector3( 0, 300, 0 ),
		bottom: new Vector3( 0, 0, 0 ),
		segmentsWidth
	});
	scene.add(capsule);

	// along X axis
	capsule = createCapsule({
		material: redMaterial,
		radius,
		top: new Vector3( 300, 0, 0 ),
		bottom: new Vector3( 0, 0, 0 ),
		segmentsWidth,
		openBottom: true
	});
	scene.add(capsule);
	
	// along Z axis
	capsule = createCapsule({
		material: blueMaterial,
		radius,
		top: new Vector3( 0, 0, 300 ),
		bottom: new Vector3( 0, 0, 0 ),
		segmentsWidth,
		openBottom: true
	});
	scene.add(capsule);

	// along XYZ axis
	capsule = createCapsule({
		material: grayMaterial,
		radius,
		top: new Vector3(200, 200, 200),
		bottom: new Vector3(0, 0, 0),
		segmentsWidth,
		openBottom: true
	});
	scene.add(capsule);

	// along -Y axis, translated in XYZ
	capsule = createCapsule({
		material: yellowMaterial,
		radius,
		top: new Vector3( 50, 100, -200 ),
		bottom: new Vector3( 50, 300, -200 ),
		segmentsWidth,
		openBottom: true
	});
	scene.add(capsule);

	// along X axis, from top of previous cylinder
	capsule = createCapsule({
		material: cyanMaterial,
		radius,
		top: new Vector3(50, 300, -200),
		bottom: new Vector3(250, 300, -200),
		segmentsWidth,
		openBottom: true
	});
	scene.add(capsule);

	// continue from bottom of previous cylinder
	capsule = createCapsule({
		material: magentaMaterial,
		radius,
		top: new Vector3(250, 300, -200),
		bottom: new Vector3(-150, 100, 0),
		segmentsWidth
	}); // try openEnded default to false
	scene.add(capsule);

  return { scene };
};

const createCapsule = (params: {
	material: Material;
	radius: number;
	top: Vector3;
	bottom: Vector3;
	segmentsWidth?: number;
	openTop?: boolean;
	openBottom?: boolean
}) => {
	const {
		material,
		radius,
		top,
		bottom,
		segmentsWidth = 32,
		openTop = false,
		openBottom = false
	} = params;

	const cylAxis = new Vector3().subVectors(top, bottom);
	const length = cylAxis.length();
	const center = new Vector3().addVectors(top, bottom).divideScalar(2);

	const cylinderGeometry = new CylinderGeometry(radius, radius, length, segmentsWidth, 1, true);
	const cylinder = new Mesh(cylinderGeometry, material);

	// pass in the cylinder itself, its desired axis, and the place to move the center.
	makeLengthAngleAxisTransform(cylinder, cylAxis, center);
	const group = new Group();
	group.add(cylinder);

	const sphereGeometry = new SphereGeometry( radius, segmentsWidth, segmentsWidth/2 );

	if (!openTop) {
		const sphere = new Mesh(sphereGeometry, material);
		sphere.position.set(top.x, top.y, top.z);
		group.add(sphere);
	}
	if (!openBottom) {
		const sphere = new Mesh(sphereGeometry, material);
		sphere.position.set(bottom.x, bottom.y, bottom.z);
		group.add(sphere);
	}

	return group;
};

// Transform cylinder to align with given axis and then move to center
const makeLengthAngleAxisTransform = (cylinder: Mesh, cylAxis: Vector3, center: Vector3) => {
	cylinder.matrixAutoUpdate = false;

	// From left to right using frames: translate, then rotate; TR.
	// So translate is first.
	cylinder.matrix.makeTranslation( center.x, center.y, center.z );

	// take cross product of cylAxis and up vector to get axis of rotation
	const yAxis = new Vector3(0,1,0);
	// Needed later for dot product, just do it now;
	// a little lazy, should really copy it to a local Vector3.
	cylAxis.normalize();
	const rotationAxis = new Vector3();
	rotationAxis.crossVectors( cylAxis, yAxis );
	if ( rotationAxis.length() < 0.000001 ) {
		// Special case: if rotationAxis is just about zero, set to X axis,
		// so that the angle can be given as 0 or PI. This works ONLY
		// because we know one of the two axes is +Y.
		rotationAxis.set( 1, 0, 0 );
	}
	rotationAxis.normalize();

	// take dot product of cylAxis and up vector to get cosine of angle of rotation
	const theta = -Math.acos( cylAxis.dot( yAxis ) );
	//cyl.matrix.makeRotationAxis( rotationAxis, theta );
	const rotMatrix = new Matrix4();
	rotMatrix.makeRotationAxis( rotationAxis, theta );
	cylinder.matrix.multiply( rotMatrix );
}

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