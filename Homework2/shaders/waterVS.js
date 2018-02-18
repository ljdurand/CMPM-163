var waterVS = 
    `
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform sampler2D tWater;

	uniform vec3 cameraPosition;
	uniform float emhmDisplaceAmt;
    
    attribute vec3 position; 
    attribute vec2 uv;
    attribute vec3 normal; 

	varying vec3 vI;
	varying vec3 vWorldNormal;
    varying float vDisplace;
    varying vec2 vUv;    

	void main() {
        vUv = uv;
        vec4 clr = texture2D(tWater, uv);
        vDisplace = clr.r * emhmDisplaceAmt;
        vec3 newPosition = (position.xyz + normal.xyz * vDisplace).xyz;
  		vec4 mvPosition = viewMatrix * modelMatrix * vec4( position, 1.0 );
  		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

  		vWorldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

  		vI = worldPosition.xyz - cameraPosition;

  		gl_Position = projectionMatrix * mvPosition;
    }`;	
