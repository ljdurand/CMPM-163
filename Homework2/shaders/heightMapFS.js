var heightMapFS = `
    precision mediump float;

    uniform sampler2D tWater, tGrass, tWall, tWall2;


    varying vec2 vUv;
    varying float vDisplace; 


    void main() {

	   vec4 water = texture2D(tWater, vUv);
	   vec4 grass = texture2D(tGrass, vUv);
	   vec4 wall = texture2D(tWall, vUv);
       vec4 wall2 = texture2D(tWall2, vUv);

	   float zOffset = vDisplace;

	   vec4 mix1 = mix(water, grass, min(1.0,zOffset*8.0));
	   vec4 mix2 = (mix(grass, wall, min(1.0, zOffset * .5)));
       vec4 mix3 = mix(mix1, mix2, zOffset);
       vec4 mix4 = mix(mix3, wall2, min(1.0, zOffset * .5));
	   vec4 mix5 = mix(mix3, mix4, zOffset);

	   gl_FragColor = vec4( mix4.rgb, 0.0 );        

   }`;	
