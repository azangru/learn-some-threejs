precision highp float;

uniform vec3 uMaterialColor;

uniform vec3 uDirLightPos;
uniform vec3 uDirLightColor;

uniform float uKd;
uniform float uScale;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vModelPosition;

float updateDiffuse(float diffuse) {
	float x = vModelPosition.x;
	float y = vModelPosition.y;
	float z = vModelPosition.z;

	float multiplier = 0.5 + 0.5 * sin( uScale * x ) * sin( uScale * y ) * sin( uScale * z );
	return diffuse * multiplier;
}

void main() {
  // compute direction to light
  vec4 lDirection = viewMatrix * vec4( uDirLightPos, 0.0 );
  vec3 lVector = normalize( lDirection.xyz );

  // diffuse: N * L. Normal must be normalized, since it's interpolated.
  vec3 normal = normalize( vNormal );

  float diffuse = max( dot( normal, lVector ), 0.0);
	diffuse = updateDiffuse(diffuse);

  gl_FragColor = vec4( uKd * uMaterialColor * uDirLightColor * diffuse, 1.0 );
}