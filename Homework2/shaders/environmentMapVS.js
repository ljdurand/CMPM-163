var environmentMapVS = `
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

	uniform vec3 cameraPosition;
	
    attribute vec3 position; 
    attribute vec3 normal; 
    attribute vec2 uv;

	//link variables between the vertex shader and the fragment shader
    varying vec2 vUV;
	varying vec3 vI;
	varying vec3 vWorldNormal;

	void main() {
  		vec4 mvPosition = viewMatrix * modelMatrix * vec4( position, 1.0 );
  		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vUV = uv;
  		vWorldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

  		vI = worldPosition.xyz - cameraPosition;

  		gl_Position = projectionMatrix * mvPosition;
	}`;	
