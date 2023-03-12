import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  Group,
  MeshPhongMaterial,
  MeshLambertMaterial,
  BoxGeometry,
  SphereGeometry,
  CylinderGeometry,
  PlaneGeometry,
  Fog,
  AmbientLight,
  PointLight,
  SpotLight,
  SpotLightHelper,
  AxesHelper,
  Camera,
  Vector3,
  MeshStandardMaterial,
  MeshBasicMaterial,
  CameraHelper
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
	renderer.setClearColor(0x0, 1.0);
  renderer.shadowMap.enabled = true;

	// CAMERA
	const camera = new PerspectiveCamera(40, canvasRatio, 1, 10000);
  camera.position.set(1160, 650, 600);

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0,310,0);
  cameraControls.update();

	const { scene } = fillScene();

  render({ renderer, scene, camera });

  cameraControls.addEventListener('change', () => {
    render({ renderer, scene, camera });
  });
};

const fillScene = () => {
	// SCENE
	const scene = new Scene();
	scene.fog = new Fog(0x0, 2000, 4000);

  // LIGHTS
	scene.add(new AmbientLight(0x222222));

  const spotLight = new SpotLight(0xffffff, 1);
  spotLight.position.set( 400, 1200, 300 );
  // spotLight.position.set(200, 500, 300);
  spotLight.angle = Math.PI / 180 * 20;
  spotLight.target.position.set( 0, 200, 0 );
  spotLight.shadow.camera.near = 100;
  spotLight.shadow.camera.far = 1600;
  spotLight.castShadow = true;
  scene.add(spotLight);

  const spotLightHelper = new SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  scene.add( new CameraHelper( spotLight.shadow.camera ) );

  const lightSphere = new Mesh(
    new SphereGeometry(10, 12, 6),
    new MeshBasicMaterial()
  );
  lightSphere.position.copy(spotLight.position);
  scene.add(lightSphere);


  // GROUND
  const solidGround = new Mesh(
		new PlaneGeometry(10000, 10000),
		new MeshPhongMaterial({ color: 0xFFFFFF }));
	solidGround.rotation.x = -Math.PI / 2;
  solidGround.receiveShadow = true;
  scene.add( solidGround );

	const axesHelper = new AxesHelper( 250 );
	scene.add(axesHelper);

  const drinkingBird = createBird();
  scene.add(drinkingBird);

  // Just to test a shadow?
  const sphereGeometry = new SphereGeometry(20, 32, 16);
  const sphereMaterial = new MeshStandardMaterial( { color: 0xff0000 } );
  const sphere = new Mesh( sphereGeometry, sphereMaterial );
  sphere.castShadow = true;
  sphere.position.x = 50;
  sphere.position.z = -200;  
  sphere.position.y = 50;
  scene.add( sphere );


  return { scene };
};

const createBird = () => {
  const bird = new Group();

  const base = createBase();
  bird.add(base);

  const feet = createFeet()
  bird.add(feet);

  const body = createBody();
  bird.add(body);

  const head = createHead()
  bird.add(head);

  bird.traverseVisible((object) => {
    if (object instanceof Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  return bird;
}

const createBase = () => {
  const footMaterial = new MeshPhongMaterial({ color: 0x960f0b, shininess: 30 });
  footMaterial.specular.setRGB(0.5, 0.5, 0.5);

  const baseWidth = 20 + 64 + 110;
  const baseHeight = 4;
  const baseDepth = 2 * 77 + 12;

  const baseGeometry = new BoxGeometry(
    baseWidth,
    baseHeight,
    baseDepth
  );

  return new Mesh(baseGeometry, footMaterial);
};

const createFeet = () => {
  const footMaterial = new MeshPhongMaterial({ color: 0x960f0b, shininess: 30 });
	footMaterial.specular.setRGB(0.5, 0.5, 0.5);

  const footWidth = 20 + 64 + 110;
  const footHeight = 52;
  const footDepth = 6;

  const footGeometry = new BoxGeometry(
    footWidth,
    footHeight,
    footDepth
  );

  const leftFoot = new Mesh(footGeometry, footMaterial);
  leftFoot.position.y = footHeight / 2;
  leftFoot.position.z = - 77 - 12 / 2 + footDepth / 2;

  const rightFoot = new Mesh(footGeometry, footMaterial);
  rightFoot.position.y = footHeight / 2;
  rightFoot.position.z = (77) + 12 / 2 - footDepth / 2;

  const ankleWidth = 64;
  const ankleHeight = 104;
  const ankleDepth = 6;

  const ankleGeometry = new BoxGeometry(
    ankleWidth,
    ankleHeight,
    ankleDepth,
  );
  const leftAnkle = new Mesh(ankleGeometry, footMaterial);
  leftAnkle.position.x = -footWidth / 4;
  leftAnkle.position.y = ankleHeight / 2;
  leftAnkle.position.z = -(77 + 6/2);

  const rightAnkle = new Mesh(ankleGeometry, footMaterial);
  rightAnkle.position.x = -footWidth / 4;
  rightAnkle.position.y = ankleHeight / 2;
  rightAnkle.position.z = 77 + 6/2;

  const legWidth = 60;
  const legHeight = 282 + 4;
  const legDepth = 4;
  const legMaterial = new MeshPhongMaterial({ color: 0xAdA79b, shininess: 4 });
  legMaterial.specular.setRGB(0.5, 0.5, 0.5);

  const legGeometry = new BoxGeometry(
    legWidth,
    legHeight,
    legDepth
  );

  const leftLeg = new Mesh(legGeometry, legMaterial);
  leftLeg.position.x = leftAnkle.position.x;
  leftLeg.position.z = leftAnkle.position.z;
  leftLeg.position.y = legHeight / 2 + leftAnkle.position.y + ankleHeight / 2;

  const rightLeg = new Mesh(legGeometry, legMaterial);
  rightLeg.position.x = rightAnkle.position.x;
  rightLeg.position.z = rightAnkle.position.z;
  rightLeg.position.y = legHeight / 2 + rightAnkle.position.y + ankleHeight / 2;

  const group = new Group();
  group.add(leftFoot);
  group.add(rightFoot);
  group.add(leftAnkle);
  group.add(rightAnkle);
  group.add(leftLeg);
  group.add(rightLeg);

  return group;
};

const createBody = () => {
  const waterMaterial = new MeshPhongMaterial( { shininess: 100 } );
  waterMaterial.color.setRGB( 31/255, 86/255, 169/255 );
	waterMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

  const waterDiameter = 104;
  const waterRadius = waterDiameter / 2;
  const waterWidthSegments = 32;
  const waterHeightSegments = 16;

  const waterGeometry = new SphereGeometry(
    waterRadius,
    waterWidthSegments,
    waterHeightSegments,
    0, // phiStart — starting angle
    Math.PI * 2, // phiLength — horizontal sweep angle size
    Math.PI / 2, // thetaStart — vertical starting angle
    Math.PI // thetaLength — vertical sweep angle size
  );
  const water = new Mesh(waterGeometry, waterMaterial);
  water.position.x = 0;
	water.position.y = 160;
	water.position.z = 0;

  const waterCapGeometry = new CylinderGeometry(
    waterRadius,
    waterRadius,
    0,
    32
  );
  const waterCap = new Mesh(waterCapGeometry, waterMaterial);
  waterCap.position.y = water.position.y;

  const waterCylinderRadius = 12/2;
  const glassCylinderHeight = 390;
  const waterCylinderHeight = glassCylinderHeight - 100;
  const waterCylinderGeometry = new CylinderGeometry(
    waterCylinderRadius,
    waterCylinderRadius,
    waterCylinderHeight,
    32
  );
  const waterCylinder = new Mesh(waterCylinderGeometry, waterMaterial);
  waterCylinder.position.y = water.position.y + waterCylinderHeight / 2;

  const glassMaterial = new MeshPhongMaterial({
    color: 0x0,
    specular: 0xFFFFFF,
    shininess: 100,
    opacity: 0.3,
    transparent: true
  });
  const glassBodyRadius = 116/2;
  const glassBodyGeometry = new SphereGeometry(glassBodyRadius, 32, 16);
  const glassBody = new Mesh(glassBodyGeometry, glassMaterial);
  glassBody.position.y = water.position.y;

  const glassCylinderRadius = 24/2;
  const glassCylinderGeometry = new CylinderGeometry(
    glassCylinderRadius,
    glassCylinderRadius,
    glassCylinderHeight,
    32
  );
  const glassCylinder = new Mesh(glassCylinderGeometry, glassMaterial);
  glassCylinder.position.y = glassBody.position.y + glassCylinderHeight / 2;

  const crossbarMaterial = new MeshPhongMaterial({ color: 0x808080, specular: 0xFFFFFF, shininess: 400 });
  const crossbarRadius = 5;
  const crossbarLength = 200;
  const crossbarY = 360;
  const crossbarGeometry = new CylinderGeometry(crossbarRadius, crossbarRadius, crossbarLength, 32);
  const crossbar = new Mesh(crossbarGeometry, crossbarMaterial);
  crossbar.position.y = crossbarY;
  crossbar.rotation.x = Math.PI / 2;

  const group = new Group();
  group.add(water);
  group.add(waterCap);
  group.add(waterCylinder);
  group.add(glassBody);
  group.add(glassCylinder);
  group.add(crossbar);

  group.position.x = -(20 + 64 + 110) / 4;

  return group;
};

const createHead = () => {
  const headMaterial = new MeshLambertMaterial();
	headMaterial.color.setRGB(104/255, 1/255, 5/255);

  const hatMaterial = new MeshPhongMaterial();
  hatMaterial.color.setRGB(24/255, 38/255, 77/255);
  hatMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

  const eyeMaterial = new MeshPhongMaterial({ color: 0x000000, specular: 0x303030, shininess: 4 });

  const headRadius = 104/2;
  const headGeometry = new SphereGeometry(
    headRadius,
    32,
    16
  );
  const head = new Mesh(headGeometry, headMaterial);
  head.position.y = 160 + 390;

  const hatBrimRadius = 142/2;
  const hatBrimGeometry = new CylinderGeometry(hatBrimRadius, hatBrimRadius, 10, 32);
  const hatBrim = new Mesh(hatBrimGeometry, hatMaterial);
  hatBrim.position.y = head.position.y + 40 + 10/2;

  const hatTopRadius = 80/2;
  const hatTopHeight = 70;
  const hatTopGeometry = new CylinderGeometry(hatTopRadius, hatTopRadius, hatTopHeight, 32);
  const hatTop = new Mesh(hatTopGeometry, hatMaterial);
  hatTop.position.y = hatBrim.position.y + hatTopHeight / 2;

  const noseBaseRadius = 14;
  const noseTipRadius = 6;
  const noseLength = 70;
  const noseGeometry = new CylinderGeometry(noseBaseRadius, noseTipRadius, noseLength, 32);
  const nose = new Mesh(noseGeometry, headMaterial);
  nose.position.y = head.position.y;
  nose.position.x = headRadius;
  nose.rotation.z = Math.PI / 2;

  const eyeGeometry = new SphereGeometry(10, 32, 16);

  const leftEye = new Mesh(eyeGeometry, eyeMaterial);
  const rightEye = new Mesh(eyeGeometry, eyeMaterial);

  const leftEyePivotPoint = new Group();
  leftEyePivotPoint.add(leftEye);
  leftEye.position.y = head.position.y + 20;
  leftEye.position.x = headRadius;
  leftEyePivotPoint.rotateY(Math.PI / 180 * 20);

  const rightEyePivotPoint = new Group();
  rightEyePivotPoint.add(rightEye);
  rightEye.position.y = head.position.y + 20;
  rightEye.position.x = headRadius;
  rightEyePivotPoint.rotateY(-Math.PI / 180 * 20);

  const group = new Group();
  group.add(head);
  group.add(hatBrim);
  group.add(hatTop);
  group.add(nose);
  group.add(leftEyePivotPoint);
  group.add(rightEyePivotPoint);

  group.position.x = -(20 + 64 + 110) / 4;

  return group;
};

let pointLight: PointLight | null = null;

const createPointLight = (position: Vector3) => {
  // LIGHTS
  const light = new PointLight(0x606060);
  light.position.copy(position);
  return light;
};

const render = (params: {
	renderer: WebGLRenderer,
	scene: Scene,
	camera: Camera
}) => {
  const { scene, renderer, camera} = params;

  if (pointLight) {
    scene.remove(pointLight);
  }

  pointLight = createPointLight(camera.position);
  scene.add(pointLight);

	renderer.render(scene, camera);

  return {
    ...params,
    scene
  };
};

export default main;