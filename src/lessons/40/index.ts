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
  PlaneGeometry,
  DoubleSide,
  Vector2,
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
  flashRadius: 2.0,
  flashOffsetX: 1.7,
  flashOffsetY: -0.3,

  shininess: 20.0,
  ka: 0.2,
  kd: 0.4,
  ks: 0.35,
  metallic: false,

  hue: 0.09,
  saturation: 0.46,
  lightness: 0.7,

  lhue: 0.04,
  lsaturation: 0.0,
  llightness: 0.7,
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
	const camera = new PerspectiveCamera(45, canvasRatio, 1, 800);
  camera.position.set(4.3, 8.9, 10.6);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0.5, 0);
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
  scene.fog = new Fog(0x808080, 2000, 4000);

  const ambientLight = new AmbientLight(0x333333); // 0.2
  ambientLight.name = 'ambient_light';

	const directionalLight = new DirectionalLight(0xFFFFFF, 1.0);
  directionalLight.name = 'light';

	scene.add(ambientLight);
	scene.add(directionalLight);

  const teapotSize = 1;
	const materialColor = new Color();
	materialColor.setRGB(0, 1, 1);

	const teapotMaterial = createShaderMaterial(directionalLight, ambientLight);
	teapotMaterial.side = DoubleSide;

  const teapotGeometry = new TeapotGeometry(teapotSize, 20, true, true, true, true);

	const teapot = new Mesh(
		teapotGeometry,
    teapotMaterial
  );
  teapot.position.y += teapotSize
  teapot.name = 'teapot';
  scene.add(teapot);

  const solidGroundMaterial = createShaderMaterial(directionalLight, ambientLight);
  solidGroundMaterial.side = DoubleSide;
  
  const solidGround = new Mesh(
		new PlaneGeometry(100, 100, 1,1),
		solidGroundMaterial
  );
	solidGround.rotation.x = - Math.PI / 2;
  solidGround.name = 'ground';
	scene.add(solidGround);

  return { scene };
};

const shaderTypes = {
  phongBalanced : {
    uniforms: {
      uDirLightPos:	{ value: new Vector3() },
      uDirLightColor: { value: new Color(0xFFFFFF) },
      uAmbientLightColor: { value: new Color(0x050505) },
      uMaterialColor: { value: new Color(0xFFFFFF) },
      uSpecularColor: { value: new Color(0xFFFFFF) },
      uFlashOffset: { value: new Vector2() },
      uFlashRadius: { value: 1.0 },
      uKd: {
        value: 0.7
      },
      uKs: {
        value: 0.3
      },
      shininess: {
        value: 100.0
      }
    }
  }
};

const createShaderMaterial = (directionalLight: Light, ambientLight: Light) => {
	const shader = shaderTypes.phongBalanced;

	var uniforms = UniformsUtils.clone(shader.uniforms);

	var material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  });

	material.uniforms.uDirLightPos.value = directionalLight.position;
	material.uniforms.uDirLightColor.value = directionalLight.color;
  material.uniforms.uAmbientLightColor.value = ambientLight.color;

	return material;
};


const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: Camera
}) => {
  const { scene, renderer, camera} = params;

  const flashlightOffset = new Vector2();
  flashlightOffset.set(-state.flashOffsetX, -state.flashOffsetY);
  
  const ground = scene.getObjectByName('ground') as Mesh;
  const groundMaterial = ground.material as ShaderMaterial;
  groundMaterial.uniforms.uFlashRadius.value = state.flashRadius;
  groundMaterial.uniforms.uFlashOffset.value.copy(flashlightOffset);

  const teapot = scene.getObjectByName('teapot') as Mesh;
  const teapotMaterial = teapot.material as ShaderMaterial;
  teapotMaterial.uniforms.uFlashRadius.value = state.flashRadius;
  teapotMaterial.uniforms.uFlashOffset.value.copy(flashlightOffset);
  teapotMaterial.uniforms.shininess.value = state.shininess;
	teapotMaterial.uniforms.uKd.value = state.kd;
	teapotMaterial.uniforms.uKs.value = state.ks;

  const materialColor = new Color();
  materialColor.setHSL(state.hue, state.saturation, state.lightness);
  teapotMaterial.uniforms.uMaterialColor.value.copy(materialColor);

  if (state.metallic) {
    materialColor.setRGB(1, 1, 1);
  }
  teapotMaterial.uniforms.uSpecularColor.value.copy(materialColor);

  // Ambient is just material's color times ka, light color is not involved
  const ambientLight = scene.getObjectByName('ambient_light') as Light;
	ambientLight.color.setHSL(state.hue, state.saturation, state.lightness * state.ka);

  const directionalLight = scene.getObjectByName('light') as Light;
  directionalLight.position.copy(camera.position);
	directionalLight.color.setHSL(state.lhue, state.lsaturation, state.llightness);

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

const setupGui = (onChange: () => void) => {
  const gui = new GUI();

  const flashlightControlFolder = gui.addFolder('Flashlight control');
  flashlightControlFolder.add(state, 'flashRadius', 0.0, 10.0, 1.0).name('radius');
  flashlightControlFolder.add(state, 'flashOffsetX', -10.0, 10.0, 1.0).name('offset X');
  flashlightControlFolder.add(state, 'flashOffsetY', -10.0, 10.0, 1.0).name('offset Y');

  const materialControlFolder = gui.addFolder('Material control');
  materialControlFolder.add(state, 'shininess', 1.0, 100.0, 1.0).name('shininess');
  materialControlFolder.add(state, 'ka', 0.0, 1.0, 0.025).name('m_ka');
  materialControlFolder.add(state, 'kd', 0.0, 1.0, 0.025).name('m_kd');
  materialControlFolder.add(state, 'ks', 0.0, 1.0, 0.025).name('m_ks');
  materialControlFolder.add(state, 'metallic');

  const materialColorFolder = gui.addFolder('Material color');
  materialColorFolder.add(state, 'hue', 0.0, 1.0, 0.025).name('hue');
  materialColorFolder.add(state, 'saturation', 0.0, 1.0, 0.025).name('saturation');
  materialColorFolder.add(state, 'lightness', 0.0, 1.0, 0.025).name('lightness');

  const lightColorFolder = gui.addFolder('Light color');
  lightColorFolder.add(state, 'lhue', 0.0, 1.0, 0.025).name('hue');
  lightColorFolder.add(state, 'lsaturation', 0.0, 1.0, 0.025).name('saturation');
  lightColorFolder.add(state, 'llightness', 0.0, 1.0, 0.025).name('lightness');

  Object.values(gui.__folders).forEach(folder => {
    folder.__controllers.forEach((controller) => {
      controller.onChange(onChange)
    });
  });
};

export default main;