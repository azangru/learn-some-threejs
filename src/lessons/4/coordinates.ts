// Modified (updated syntax) from https://github.com/udacity/cs291/blob/master/lib/Coordinates.js

import {
  type Scene,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  CylinderGeometry,
  DoubleSide
} from 'three';

export const drawGrid = (params: {
  scene: Scene;
  size?: number;
  scale?: number;
  orientation?: string;
}) => {
  const {
    scene,
    size = 100,
    scale = 0.1,
    orientation = 'x'
  } = params;
  var grid = new Mesh(
    new PlaneGeometry(size, size, size * scale, size * scale),
    new MeshBasicMaterial({ color: 0x555555, wireframe: true })
  );
  // Yes, these are poorly labeled! It would be a mess to fix.
  // What's really going on here:
  // "x" means "rotate 90 degrees around x", etc.
  // So "x" really means "show a grid with a normal of Y"
  //    "y" means "show a grid with a normal of X"
  //    "z" means (logically enough) "show a grid with a normal of Z"
  if (orientation === "x") {
    grid.rotation.x = - Math.PI / 2;
  } else if (orientation === "y") {
    grid.rotation.y = - Math.PI / 2;
  } else if (orientation === "z") {
    grid.rotation.z = - Math.PI / 2;
  }

  scene.add(grid);
};


export const drawGround = (params: {
  scene: Scene;
  size?: number;
  color?: number | string;
}) => {
  const {
    scene,
    size = 100,
    color = 0xFFFFFF,
  } = params;
  const ground = new Mesh(
    new PlaneGeometry(size, size),
    // When we use a ground plane we use directional lights, so illuminating
    // just the corners is sufficient.
    // Use MeshPhongMaterial if you want to capture per-pixel lighting:
    // new THREE.MeshPhongMaterial({ color: color, specular: 0x000000,
    new MeshLambertMaterial({
      color: color,
      // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
      // the grid do not have z-fighting with the grid:
      // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
      // Units == 4 is a fixed amount to move back, and 4 is usually a good value
      polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
    }));
  ground.rotation.x = - Math.PI / 2;
  scene.add(ground);
};

export const drawAxes = (params: {
  scene: Scene;
  axisRadius: number;
  axisLength: number;
  axisTess: number;
  axisOrientation: string;
}) => {
  // x = red, y = green, z = blue  (RGB = xyz)
  const {
    scene,
    axisRadius = 0.04,
    axisLength = 11,
    axisTess = 48,
    axisOrientation = 'x'
  } = params;

  const axisMaterial = new MeshLambertMaterial({ color: 0x000000, side: DoubleSide });
  var axis = new Mesh(
    new CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisMaterial
  );
  if (axisOrientation === "x") {
    axis.rotation.z = - Math.PI / 2;
    axis.position.x = axisLength / 2 - 1;
  } else if (axisOrientation === "y") {
    axis.position.y = axisLength / 2 - 1;
  }

  scene.add(axis);

  var arrow = new Mesh(
    new CylinderGeometry(0, 4 * axisRadius, 8 * axisRadius, axisTess, 1, true),
    axisMaterial
  );
  if (axisOrientation === "x") {
    arrow.rotation.z = - Math.PI / 2;
    arrow.position.x = axisLength - 1 + axisRadius * 4 / 2;
  } else if (axisOrientation === "y") {
    arrow.position.y = axisLength - 1 + axisRadius * 4 / 2;
  }

  scene.add(arrow);
};

export const drawAllAxes = (params: {
  scene: Scene;
  axisRadius: number;
  axisLength: number;
  axisTess: number;
}) => {
  const {
    scene,
    axisRadius = 0.04,
    axisLength = 11,
    axisTess = 48
  } = params;

  const axisXMaterial = new MeshLambertMaterial({ color: 0xFF0000 });
  const axisYMaterial = new MeshLambertMaterial({ color: 0x00FF00 });
  const axisZMaterial = new MeshLambertMaterial({ color: 0x0000FF });
  axisXMaterial.side = DoubleSide;
  axisYMaterial.side = DoubleSide;
  axisZMaterial.side = DoubleSide;

  const axisX = new Mesh(
    new CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisXMaterial
  );
  const axisY = new Mesh(
    new CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisYMaterial
  );
  const axisZ = new Mesh(
    new CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
    axisZMaterial
  );
  axisX.rotation.z = - Math.PI / 2;
  axisX.position.x = axisLength / 2 - 1;
  axisY.position.y = axisLength / 2 - 1;

  axisZ.rotation.y = - Math.PI / 2;
  axisZ.rotation.z = - Math.PI / 2;
  axisZ.position.z = axisLength / 2 - 1;

  scene.add(axisX);
  scene.add(axisY);
  scene.add(axisZ);

  var arrowX = new Mesh(
    new CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
    axisXMaterial
  );
  var arrowY = new Mesh(
    new CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
    axisYMaterial
  );
  var arrowZ = new Mesh(
    new CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
    axisZMaterial
  );
  arrowX.rotation.z = - Math.PI / 2;
  arrowX.position.x = axisLength - 1 + axisRadius * 4 / 2;

  arrowY.position.y = axisLength - 1 + axisRadius * 4 / 2;

  arrowZ.rotation.z = - Math.PI / 2;
  arrowZ.rotation.y = - Math.PI / 2;
  arrowZ.position.z = axisLength - 1 + axisRadius * 4 / 2;

  scene.add(arrowX);
  scene.add(arrowY);
  scene.add(arrowZ);
}