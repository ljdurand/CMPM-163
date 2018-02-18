var shaderFS = 
    `
    precision mediump float;
 	
	uniform sampler2D t1;

	varying vec2 UV;

    precision mediump float;

	void main() {
       
       vec4 c1 = texture2D(t1, UV);
       gl_FragColor = vec4(c1);
    }`;	
