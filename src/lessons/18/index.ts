import {
  Scene,
  WebGLRenderer,
	Vector3,
  Mesh,
	Matrix4,
  MeshLambertMaterial,
  CylinderGeometry,
  Fog,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
	AxesHelper,
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

	const radiusTop = 50;
	const radiusBottom = 0;
	const segmentsWidth = 32;
	const openEnded = false;
	
	let cylinder;

	// along Y axis
	cylinder = createCylinderFromEnds({
		material: greenMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3( 0, 300, 0 ),
		bottom: new Vector3( 0, 0, 0 ),
		segmentsWidth,
		openEnded
	});
	scene.add(cylinder);

	// along X axis
	cylinder = createCylinderFromEnds({
		material: redMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3( 300, 0, 0 ),
		bottom: new Vector3( 0, 0, 0 ),
		segmentsWidth,
		openEnded
	});
	scene.add( cylinder );
	
	// along Z axis
	cylinder = createCylinderFromEnds({
		material: blueMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3( 0, 0, 300 ),
		bottom: new Vector3( 0, 0, 0 ),
		segmentsWidth,
		openEnded
	});
	scene.add( cylinder );

	// along XYZ axis
	cylinder = createCylinderFromEnds({
		material: grayMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3(200, 200, 200),
		bottom: new Vector3(0, 0, 0),
		segmentsWidth,
		openEnded
	});
	scene.add( cylinder );

	// along -Y axis, translated in XYZ
	cylinder = createCylinderFromEnds({
		material: yellowMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3( 50, 100, -200 ),
		bottom: new Vector3( 50, 300, -200 ),
		segmentsWidth,
		openEnded
	});
	scene.add( cylinder );

	// along X axis, from top of previous cylinder
	cylinder = createCylinderFromEnds({
		material: cyanMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3(50, 300, -200),
		bottom: new Vector3(250, 300, -200),
		segmentsWidth,
		openEnded
	});
	scene.add( cylinder );

	// continue from bottom of previous cylinder
	cylinder = createCylinderFromEnds({
		material: magentaMaterial,
		radiusTop,
		radiusBottom,
		top: new Vector3(250, 300, -200),
		bottom: new Vector3(-150, 100, 0),
		segmentsWidth,
		openEnded
	}); // try openEnded default to false
	scene.add( cylinder );

  return { scene };
};

const createCylinderFromEnds = (params: {
	material: Material;
	radiusTop: number;
	radiusBottom: number;
	top: Vector3;
	bottom: Vector3;
	segmentsWidth?: number;
	openEnded?: boolean
}) => {
	const {
		material,
		radiusTop,
		top,
		bottom,
		radiusBottom,
		segmentsWidth = 32,
		openEnded = false
	} = params;

	const cylAxis = new Vector3().subVectors(top, bottom);
	const length = cylAxis.length();
	const center = new Vector3().addVectors(top, bottom).divideScalar(2);

	const cylinderGeometry = new CylinderGeometry(radiusTop, radiusBottom, length, segmentsWidth, 1, openEnded);
	const cylinder = new Mesh(cylinderGeometry, material);

	// pass in the cylinder itself, its desired axis, and the place to move the center.
	makeLengthAngleAxisTransform(cylinder, cylAxis, center);

	return cylinder;
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