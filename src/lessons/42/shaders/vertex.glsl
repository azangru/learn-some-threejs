varying vec3 vNormal;
varying vec3 vViewPosition;

uniform float uSphereRadius2;  // squared

void main() {
  vec3 newPosition = position;

  // zpos = square root ( uSphereRadius2 - xpos^2 - ypos^2) - sqrt(uSphereRadius2)
  newPosition.z = sqrt(
    uSphereRadius2 -
    pow(newPosition.x, 2.0) -
    pow(newPosition.y, 2.0)
  );

  vec3 newNormal = newPosition;

  // offset the surface so the center stays in view; do this after the new normal is set
  newPosition.z -= sqrt(uSphereRadius2);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vNormal = normalize(normalMatrix * newNormal);
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0 );
  vViewPosition = -mvPosition.xyz;
}