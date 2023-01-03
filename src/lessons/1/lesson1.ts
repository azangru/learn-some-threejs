import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';

import styles from './lesson1.module.css';

const main = () => {
  const canvas = document.createElement('canvas');
  canvas.classList.add(styles.canvas);
  document.body.appendChild(canvas);

  renderCube(canvas);
};

const renderCube = (canvas: HTMLCanvasElement) => {
  const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

  const scene = new Scene();
  const camera = new PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );
  
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize( canvasWidth, canvasHeight );

  const geometry = new BoxGeometry( 1, 1, 1 );
  const material = new MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;


  animate({ cube, renderer, scene, camera });
};

const animate = (params: {
  cube: Mesh,
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera
}) => {
  const { cube, renderer, scene, camera } = params;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render( scene, camera );

  requestAnimationFrame(() => animate(params));
};

export default main;