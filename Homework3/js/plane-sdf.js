
function createPlaneSDF(w, h) {

    //create plane geometry, the only actual geometry in the scene
    var geometry = new THREE.PlaneGeometry(w,h);

    var shaderInput = {
        resolution: {type: "v2", value: new THREE.Vector2(w,h) },
        iTime: { type: "f", value: 0.0 },
    };

    var material = new THREE.ShaderMaterial({
        uniforms: shaderInput,
        vertexShader: sdfVShader,
        fragmentShader: sdfFShader
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.Start = function() {
    };

    mesh.Update = function() {
        //change iTime
        mesh.material.uniforms.iTime.value += .01;
    };

    return mesh;
}
