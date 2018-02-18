var noiseFS = 
    `
    precision mediump float;
	
    varying float noiseVal;
    varying float noiseVal2;


    void main()	{

        vec3 color = vec3( 1.0 * ( 1.0 - (3.0 * noiseVal) ), 0.0, 0.0 );
        vec3 color2 = vec3( 1.0, 1.0 * ( 1.0 - (3.0 * noiseVal2) ), 0.0 );
  
        gl_FragColor = vec4( color.r, color2.gb, 1.0 );        

    }`;	
