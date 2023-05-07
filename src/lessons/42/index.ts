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
  Vector3,
  Color,
  UniformsUtils,
  type Light
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GUI } from 'dat.gui';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import styles from './styles.module.css';

let cameraControls: OrbitControls;

const state = {
  sphereRadius: 1.0,
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

  lx: 0.01,
  ly: 1,
  lz: 0.01
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
	const camera = new PerspectiveCamera(45, canvasRatio, 0.001, 80);
  camera.position.set(-1.41, 0.14, -0.56);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, -0.45, 0);
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

  const solidGroundMaterial = createShaderMaterial(directionalLight, ambientLight);
  solidGroundMaterial.side = DoubleSide;
  
  const solidGround = new Mesh(
		new PlaneGeometry(1, 1, 100, 100),
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
      uKd: {
        value: 0.7
      },
      uKs: {
        value: 0.3
      },
      shininess: {
        value: 100.0
      },
      uSphereRadius2: {
        value: 1.0
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
  
  const ground = scene.getObjectByName('ground') as Mesh;
  const groundMaterial = ground.material as ShaderMaterial;
  groundMaterial.uniforms.shininess.value = state.shininess;
	groundMaterial.uniforms.uKd.value = state.kd;
	groundMaterial.uniforms.uKs.value = state.ks;

  const materialColor = new Color();
  materialColor.setHSL(state.hue, state.saturation, state.lightness);
  groundMaterial.uniforms.uMaterialColor.value.copy(materialColor);

  if (state.metallic) {
    materialColor.setRGB(1, 1, 1);
  }
  groundMaterial.uniforms.uSpecularColor.value.copy(materialColor);

  // Ambient is just material's color times ka, light color is not involved
  const ambientLight = scene.getObjectByName('ambient_light') as Light;
	ambientLight.color.setHSL(state.hue, state.saturation, state.lightness * state.ka);

  const directionalLight = scene.getObjectByName('light') as Light;
  directionalLight.position.set(state.lx, state.ly, state.lz);
	directionalLight.color.setHSL(state.lhue, state.lsaturation, state.llightness);

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

const setupGui = (onChange: () => void) => {
  const gui = new GUI();

  const materialControlFolder = gui.addFolder('Material control');
  materialControlFolder.add(state, 'sphereRadius', 0.7072, 10.0, 1.0).name('sphere radius');
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

  const lightDirectionFolder = gui.addFolder('Light direction');
  lightDirectionFolder.add(state, 'lx', -1.0, 1.0, 0.025).name('x');
  lightDirectionFolder.add(state, 'ly', -1.0, 1.0, 0.025).name('y');
  lightDirectionFolder.add(state, 'lz', -1.0, 1.0, 0.025).name('z');

  Object.values(gui.__folders).forEach(folder => {
    folder.__controllers.forEach((controller) => {
      controller.onChange(onChange)
    });
  });
};

export default main;