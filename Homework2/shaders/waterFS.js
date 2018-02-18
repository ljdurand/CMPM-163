var waterFS = `
    precision mediump float;

    uniform sampler2D tWater;
    uniform samplerCube skybox;

    varying vec3 vI;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    varying float vDisplace; 


    void main() {
    
       vec3 reflection = reflect(vI, vWorldNormal);
       vec4 envColor = textureCube(skybox, vec3(-reflection.x, reflection.yz));

	   vec4 water = texture2D(tWater, vUv);

	   float zOffset = vDisplace;

	   gl_FragColor = vec4( envColor, water, 1.0 );        
   }`;	