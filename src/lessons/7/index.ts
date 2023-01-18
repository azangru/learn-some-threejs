import {
  Scene,
  WebGLRenderer,
  Mesh,
	MeshLambertMaterial,
	SphereGeometry,
  PerspectiveCamera,
	AmbientLight,
	DirectionalLight,
	DataTexture,
	Fog,
	AxesHelper,
	MathUtils
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
	const camera = new PerspectiveCamera( 55, canvasRatio, 1, 4000 );
	camera.position.set(-300, 300, -1000);
	camera.lookAt(0,0,0);

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
	const ambientLight = new AmbientLight(0xFFFFFF);
	const light = new DirectionalLight(0xFFFFFF, 0.4);
	light.position.set(-800, 900, 300);
	scene.add(ambientLight);
	scene.add(light);

	const ball = createBall()
	scene.add(ball);

	const axesHelper = new AxesHelper(500);
	scene.add(axesHelper);
	
  return scene;
};

const createBall = () => {
	// Do not change the color itself, change the material and use the ambient and diffuse components.
	const geometry = new SphereGeometry(400, 64, 32);
	const material = new MeshLambertMaterial({ color: 0x80FC66 });
	material.color.r = 0.3;
	material.color.g = 0.7;
	material.flatShading = true; // makes the surface look faceted
	material.emissive.setHex(0x004a4a);
  material.emissiveIntensity = 0.45;
	const texture = createTexture();
	material.aoMap = texture;

	const sphere = new Mesh(geometry, material);
	return sphere;
};

const createTexture = () => {
	const width = 16;
	const height = 16;
	const size = width * height;
	const data = new Uint8Array(4 * size);
	for (let i = 0; i < size; i++) {
			const stride = i * 4;
			const v = Math.floor(MathUtils.seededRandom() * 255);
			data[stride] = v;
			data[stride + 1] = v;
			data[stride + 2] = v;
			data[stride + 3] = 255;
	}
	const texture = new DataTexture(data, width, height);
	texture.needsUpdate = true;
	return texture;
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