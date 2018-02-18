var shaderVS = 
    `
 	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
	attribute vec2 texCoords;
    
	varying vec2 UV;

	void main() {
       
       	UV = texCoords;
		
		vec4 position = viewMatrix * modelMatrix * vec4(position, 1.0);
        
       	gl_Position = projectionMatrix  * position;
    }`;	
