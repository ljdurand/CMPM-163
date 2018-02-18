var environmentMapFS = 

 `
    precision mediump float;

    uniform samplerCube envMap;
    uniform sampler2D t1;
    uniform float mixValue;

    varying vec2 vUV;

    varying vec3 vI;
    varying vec3 vWorldNormal;


    void main() {
        vec4 c1 = texture2D(t1, vUV);
  		vec3 reflection = reflect( vI, vWorldNormal );
  		vec4 envColor = textureCube( envMap, vec3( -reflection.x, reflection.yz ) );
        vec4 col = vec4(mix(c1, envColor, mixValue));
  		gl_FragColor = vec4(col);
    }`;

