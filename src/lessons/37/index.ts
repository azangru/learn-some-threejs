import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Fog,
  ShaderMaterial,
  Mesh,
  Camera,
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Vector3,
  Color,
  UniformsUtils,
  type Light
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';

import { GUI } from 'dat.gui';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import styles from './styles.module.css';

let cameraControls: OrbitControls;

const state = {
  kd: 0.7,
  scale: 0.2,

  hue: 0.09,
  saturation: 0.46,
  lightness: 0.7,

  lhue: 0.04,
  lsaturation: 0.01,
  llightness: 0.7,

  lx: 0.32,
  ly: 0.39,
  lz: 0.7
};

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
	const camera = new PerspectiveCamera(45, canvasRatio, 1, 80000);
  camera.position.set(-600, 900, 1300);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
  cameraControls.update();

	const { scene } = fillScene();

  render({ renderer, scene, camera });

  setupGui(() => render({ renderer, scene, camera }));

  cameraControls.addEventListener('change', () => {
    render({ renderer, scene, camera });
  });
};

const fillScene = () => {
	// SCENE
	const scene = new Scene();
  scene.fog = new Fog(0xAAAAAA, 2000, 4000);

  const ambientLight = new AmbientLight(0x333333); // 0.2

	const directionalLight = new DirectionalLight(0xFFFFFF, 1.0);
	directionalLight.position.set(320, 390, 700);
  directionalLight.name = 'light';

	scene.add(ambientLight);
	scene.add(directionalLight);

  const teapotSize = 400;
	const materialColor = new Color();
	materialColor.setRGB(1.0, 0.8, 0.6);

	const phongMaterial = createShaderMaterial(directionalLight);

	phongMaterial.uniforms.uMaterialColor.value.copy(materialColor);
	phongMaterial.side = DoubleSide;

  const teapotGeometry = new TeapotGeometry(teapotSize, 20, true, true, true, true);

	const teapot = new Mesh(
		teapotGeometry,
    phongMaterial
  );
  teapot.name = 'teapot';
  scene.add(teapot);

  return { scene };
};

const shaderTypes = {
  phongDiffuse : {
    uniforms: {
      "uDirLightPos":	{ type: "v3", value: new Vector3() },
      "uDirLightColor": { type: "c", value: new Color( 0xFFFFFF ) },
      "uMaterialColor": { type: "c", value: new Color( 0xFFFFFF ) },
      uKd: {
        value: 0.7
      },
      uScale: {
        value: 0.2
      }
    }
  }
};

const createShaderMaterial = (light: Light) => {
	const shader = shaderTypes.phongDiffuse;

	var uniforms = UniformsUtils.clone(shader.uniforms);

	var material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  });

	material.uniforms.uDirLightPos.value = light.position;
	material.uniforms.uDirLightColor.value = light.color;

	return material;
};


const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: Camera
}) => {
  const { scene, renderer, camera} = params;

  const teapot = scene.getObjectByName('teapot') as Mesh;
  const teapotMaterial = teapot.material as ShaderMaterial;
  teapotMaterial.uniforms.uKd.value = state.kd;
  teapotMaterial.uniforms.uScale.value = state.scale;


	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

const setupGui = (onChange: () => void) => {
  const gui = new GUI();
  
  const materialControlFolder = gui.addFolder('Material control');
  materialControlFolder.add(state, 'kd', 0.0, 1.0, 0.025).name('Kd');
  materialControlFolder.add(state, 'scale', 0.01, 1.0, 0.025).name('function scale');

  const materialColorFolder = gui.addFolder('Material color');
  materialColorFolder.add(state, 'hue', 0.0, 1.0, 0.025).name('hue');
  materialColorFolder.add(state, 'saturation', 0.0, 1.0, 0.025).name('saturation');
  materialColorFolder.add(state, 'lightness', 0.0, 1.0, 0.025).name('lightness');

  const lightColorFolder = gui.addFolder('Light color');
  lightColorFolder.add(state, 'lhue', 0.0, 1.0, 0.025).name('hue');
  lightColorFolder.add(state, 'lsaturation', 0.0, 1.0, 0.025).name('saturation');
  lightColorFolder.add(state, 'llightness', 0.0, 1.0, 0.025).name('lightness');

  const lightDirectionFolder = gui.addFolder('Light direction');
  lightDirectionFolder.add(state, 'lx', 0.0, 1.0, 0.025).name('x');
  lightDirectionFolder.add(state, 'ly', 0.0, 1.0, 0.025).name('y');
  lightDirectionFolder.add(state, 'lz', 0.0, 1.0, 0.025).name('z');

  Object.values(gui.__folders).forEach(folder => {
    folder.__controllers.forEach((controller) => {
      controller.onChange(onChange)
    });
  });
};

export default main;