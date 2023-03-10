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

	const radius = 60;
	const tube = 10;
	const radialSegments = 24;
	const height = 300;
	const segmentsWidth = 12;
	const arc = 2;
	
	let helix;

	helix = createHelix({
		material: redMaterial,
		radius,
		tube,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc,
		clockwise: true 
	});
	helix.position.y = height/2;
	scene.add(helix);

	helix = createHelix({
		material: greenMaterial,
		radius: radius/2,
		tube,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc,
		clockwise: false
	});
	helix.position.y = height/2;
	scene.add( helix );

	// DNA
	helix = createHelix({
		material: blueMaterial,
		radius,
		tube: tube / 2,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc,
		clockwise: false
	});
	helix.position.y = height/2;
	helix.position.z = 2.5 * radius;
	scene.add( helix );

	helix = createHelix({
		material: blueMaterial,
		radius,
		tube: tube / 2,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc,
		clockwise: false
	});
	helix.rotation.y = 120 * Math.PI / 180;
	helix.position.y = height/2;
	helix.position.z = 2.5 * radius;
	scene.add( helix );


	helix = createHelix({
		material: grayMaterial,
		radius,
		tube: tube / 2,
		radialSegments,
		tubularSegments: segmentsWidth,
		height: height / 2,
		arc,
		clockwise: true
	});
	helix.position.y = height / 2;
	helix.position.x = 2.5 * radius;
	scene.add(helix);

	helix = createHelix({
		material: yellowMaterial,
		radius: 0.75*radius,
		tube: tube / 2,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc: 4 * arc,
		clockwise: false
	});
	helix.position.y = height/2;
	helix.position.x = 2.5 * radius;
	helix.position.z = -2.5 * radius;
	scene.add( helix );

	helix = createHelix({
		material: cyanMaterial,
		radius: 0.75*radius,
		tube: 4 * tube,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc: 2 * arc,
		clockwise: false
	});
	helix.position.y = height/2;
	helix.position.x = 2.5 * radius;
	helix.position.z = 2.5 * radius;
	scene.add( helix );

	helix = createHelix({
		material: magentaMaterial,
		radius,
		tube,
		radialSegments,
		tubularSegments: segmentsWidth,
		height,
		arc,
		clockwise: true
	});
	helix.rotation.x = 45 * Math.PI / 180;
	helix.position.y = height/2;
	helix.position.z = -2.5 * radius;
	scene.add( helix );

  return { scene };
};

const createHelix = (params: {
	material: Material;
	radius: number; // radius of helix itself
	tube: number; // radius of tube
	radialSegments: number; // number of capsules around a full circle
	tubularSegments: number; // tessellation around equator of each tube
	height: number; // height to extend, from *center* of tube ends along Y axis
	arc: number; // how many times to go around the Y axis; currently just an integer
	clockwise: boolean; // if true, go counterclockwise up the axis
}) => {
	const {
		material,
		radius,
		tube,
		radialSegments,
		tubularSegments = 32,
		height,
		arc = 1,
		clockwise = true
	} = params;

	const helix = new Group();
	const top = new Vector3();
	const bottom = new Vector3();
	const sine_sign = clockwise ? 1 : -1;

	let cylinderGeometry: CylinderGeometry | undefined;
	let sphereGeometry: SphereGeometry | undefined;

	for (let i = 1; i <= arc * radialSegments; i++) {
		// going from X to Z axis
		const j = i - 1;
		top.set(
			radius * Math.cos(i * 2 * Math.PI / radialSegments),
			height * (i / (arc * radialSegments)) - height/2,
			sine_sign * radius * Math.sin(i * 2 * Math.PI / radialSegments)
		);
		bottom.set(
			radius * Math.cos(j * 2 * Math.PI / radialSegments),
			height * (j / (arc * radialSegments)) - height/2,
			sine_sign * radius * Math.sin(j * 2 * Math.PI / radialSegments)
		);

		if (!(cylinderGeometry && sphereGeometry)) {
			const capsuleLength = new Vector3().subVectors(top, bottom).length();
			const capsuleGeometries = createGeometriesForCapsule({
				radius: tube,
				length: capsuleLength,
				segmentsWidth: tubularSegments
			});
			cylinderGeometry = capsuleGeometries.cylinderGeometry;
			sphereGeometry = capsuleGeometries.sphereGeometry;
		}

		const capsule = createCapsule({
			material,
			radius: tube,
			segmentsWidth: tubularSegments,
			cylinderGeometry,
			sphereGeometry,
			top,
			bottom
		});

		helix.add(capsule);
	}

	return helix;
}

const createGeometriesForCapsule = (params: {
	radius: number;
	length: number;
	segmentsWidth?: number;
}) => {
	const { radius, length, segmentsWidth = 32 } = params;
	const cylinderGeometry = new CylinderGeometry(radius, radius, length, segmentsWidth, 1, true);
	const sphereGeometry = new SphereGeometry(radius, segmentsWidth, segmentsWidth/2);

	return {
		cylinderGeometry,
		sphereGeometry
	};
};

const createCapsule = (params: {
	material: Material;
	cylinderGeometry: CylinderGeometry;
	sphereGeometry: SphereGeometry
	radius: number;
	top: Vector3;
	bottom: Vector3;
	segmentsWidth?: number;
	openTop?: boolean;
	openBottom?: boolean
}) => {
	const {
		material,
		cylinderGeometry,
		sphereGeometry,
		top,
		bottom,
		openTop = false,
		openBottom = false
	} = params;

	const cylAxis = new Vector3().subVectors(top, bottom);
	const center = new Vector3().addVectors(top, bottom).divideScalar(2);

	const cylinder = new Mesh(cylinderGeometry, material);

	// pass in the cylinder itself, its desired axis, and the place to move the center.
	makeLengthAngleAxisTransform(cylinder, cylAxis, center);
	const group = new Group();
	group.add(cylinder);

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