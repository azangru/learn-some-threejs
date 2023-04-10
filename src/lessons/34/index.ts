import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  Camera,
  AmbientLight,
  DirectionalLight,
  MeshPhongMaterial,
  Mesh,
  Texture
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';

import waterTextureImageUrl from './water.jpg';

import styles from './styles.module.css';

let cameraControls: OrbitControls;

const main = async () => {
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
	const camera = new PerspectiveCamera(45, canvasRatio, 100, 20000);
  camera.position.set(0, 0, 246);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
  cameraControls.update();

	const { scene } = await fillScene();

  render({ renderer, scene, camera });

  cameraControls.addEventListener('change', () => {
    render({ renderer, scene, camera });
  });
};

// Strangely, the synchronous-looking code as described in the docs didn't work.
const loadTexture = async (path: string) => {
  const loadPromise = new Promise<Texture>(resolve => {
    new TextureLoader().load(path, (texture) => {
      resolve(texture);
    });
  });

  return await loadPromise;
}

const fillScene = async () => {
	// SCENE
	const scene = new Scene();

  // LIGHTS
	scene.add(new AmbientLight(0x333333));
	const directionalLight1 = new DirectionalLight(0xFFFFFF, 0.9);
	directionalLight1.position.set( 200, 300, 500 );
	scene.add(directionalLight1);
	const directionalLight2 = new DirectionalLight(0xFFFFFF, 0.7);
	directionalLight2.position.set(-200, -100, -400);
	scene.add(directionalLight2);

  const geometry = new TeapotGeometry();
  const material = await createMaterial();

  const mesh = new Mesh(geometry, material);

	scene.add(mesh);

  return { scene };
};

const createMaterial = async () => {
	// MATERIALS
	// Student: use the texture '/media/img/cs291/textures/water.jpg'
  const texture = await loadTexture(waterTextureImageUrl);

	const material = new MeshPhongMaterial({
    specularMap: texture,
    shininess: 50
  });
	material.color.setHSL( 0.09, 0.46, 0.2 );
	// material.ambient.copy( material.color );
	material.specular.setHSL( 0.09, 0.46, 1.0 );

	return material;
}



const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: Camera
}) => {
  const { scene, renderer, camera} = params;

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

export default main;