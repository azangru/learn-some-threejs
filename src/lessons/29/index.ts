import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  TextureLoader,
  MeshBasicMaterial,
  Mesh,
  Camera,
  BufferAttribute,
  DoubleSide,
  Texture
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import textureImageUrl from './ash_uvgrid01.jpg';

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
  renderer.setClearColor(0xFFFFFF, 1.0);

	// CAMERA
	const camera = new PerspectiveCamera(1, canvasRatio, 50, 150);
  camera.position.set( 0.5, 0.5, 100);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0.5, 0.5, 0);
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

  const geometry = createSquareGeometry();
	const material = new MeshBasicMaterial({ map: texture, side: DoubleSide });
	const mesh = new Mesh(geometry, material);
	scene.add(mesh);

  return { scene };
};

const createSquareGeometry = () => {
  const vertices = [
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 1.0, 0.0,

    0.0, 0.0, 0.0,
    1.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
  ];

  const uvs = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    0.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];

  // const indices = [
  //   0, 2, 1
  // ];

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  // geometry.setIndex( new BufferAttribute( new Uint32Array(indices), 1 ) );

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