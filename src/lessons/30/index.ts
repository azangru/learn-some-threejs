import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  TextureLoader,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Mesh,
  Camera,
  BufferAttribute,
  DoubleSide,
  Texture,
  Vector3
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import textureImageUrl from './disc.png';

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
	const camera = new PerspectiveCamera(55, canvasRatio, 2, 8000);
  camera.position.set(10, 5, 15);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
  cameraControls.update();

  const texture = await loadTexture();

	const { scene } = fillScene(texture);

  render({ renderer, scene, camera });

  cameraControls.addEventListener('change', () => {
    render({ renderer, scene, camera });
  });
};

// Strangely, the synchronous-looking code as described in the docs didn't work.
const loadTexture = async () => {
  const loadPromise = new Promise<Texture>(resolve => {
    new TextureLoader().load(textureImageUrl, (texture) => {
      resolve(texture);
    });
  });

  return await loadPromise;
}

const fillScene = (texture: Texture) => {
	// SCENE
	const scene = new Scene();

  const geometry = createPointsGeometry();
  const material = new PointsMaterial({
    size: 20,
    sizeAttenuation: false,
    map: texture,
    transparent: true,
    alphaTest: 0.5 // <-- to discard transparent fragments of the texture
  });
  material.color.setHSL(0.9, 0.2, 0.6);

  const particleSystem = new Points(geometry, material);

	scene.add(particleSystem);

  return { scene };
};

const createPointsGeometry = () => {
  const vertices: number[] = [];

  const vertex = new Vector3();

  for (let i = -1000; i <= 1000; i+=100) {
    for (let j = -1000; j <= 1000; j+=100) {
      for (let k = -1000; k <= 1000; k+=100) {
        vertex.x = i;
        vertex.y = j;
        vertex.z = k;

        vertices.push(...vertex.toArray());
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));

  return geometry;
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