var sdfVShader = `
        varying vec3 v_pos;
        
        void main() {
            v_pos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

var sdfFShader = `
        const int MAX_MARCHING_STEPS = 300;
        const float EPSILON = 0.0001;
        const float START = 0.0;
        const float END = 300.0;

        uniform vec2 resolution;
        uniform float iTime;
    
        varying vec3 v_pos;

        float sphereSDF(vec3 point, float radius) {
            return(length(point) - radius);
        }

        float boxSDF(vec3 point, vec3 size) {
          return length(max(abs(point)-size,0.0));
        }

        //make a torus
        float sdTorus( vec3 p, vec2 t ){
          vec2 q = vec2(length(p.xz)-t.x,p.y);
          return length(q)-t.y;
        }

        mat4 rotateY(float theta) {
            float c = cos(theta);
            float s = sin(theta);

            return mat4(
                vec4(c, 0, s, 0),
                vec4(0, 1, 0, 0),
                vec4(-s, 0, c, 0),
                vec4(0, 0, 0, 1)
            );
        }

        //apply twist to the torus
        float opTwist(vec3 p){
            float c = cos(6.0*p.y);
            float s = sin(6.0*p.y);
            mat2 m = mat2(c, -s, s, c);
            vec3 q = vec3(m*p.xz, p.y);
            return sdTorus(q, vec2(1.0, 2.0) );
        }

       float opBlend(vec3 samplePoint) {
            float d1 = sphereSDF((samplePoint/1.2) * .3, 3.2);
            vec3 torusPoint = (rotateY(-iTime) * vec4(samplePoint, 1.0)).xyz;
            float d2 = opTwist(torusPoint);
            float a = sin(iTime)/2.6;
            return a * d1 * (1.0-a) + d2;
            //return max(-d1, d2);
        }
    
        float opRep(vec3 p, vec3 c){
            vec3 q = mod(p, c) - 0.5*c;
            return opBlend(q);
        }

        float sceneSDF(vec3 samplePoint) {
            //return opBlend(samplePoint);
            return opRep(samplePoint, vec3(12.0, 8.0, 0.0));
        }

        vec3 estimateNormal(vec3 p) {
            return normalize(vec3(
                sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
                sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
                sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
            ));
        }

        // Cheated and copied from shader toy example:
        // https://www.shadertoy.com/view/lt33z7
        vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
            vec2 xy = fragCoord;
            float z = size.y / tan(radians(fieldOfView) / 2.0);
            return normalize(vec3(xy, -z));
        }

        // Cheated and copied from shader toy example:
        // https://www.shadertoy.com/view/lt33z7
        mat3 rayMarchViewMatrix(vec3 cam, vec3 center, vec3 up) {
            // Based on gluLookAt man page
            vec3 f = normalize(center - cam);
            vec3 s = normalize(cross(f, up));
            vec3 u = cross(s, f);
            return mat3(s, u, -f);
        }

        float rayMarch(vec3 cam, vec3 dir, float start, float end) {
            float step = start;
            for(int i = 0; i < MAX_MARCHING_STEPS; i++) {
                float dist = sceneSDF(cam + step * dir);
                if(dist < EPSILON) {
                    // I am inside the geometry
                    return step;
                }

                step += dist;
                if(step >= end) {
                    return end;
                }
            }

            return end;
        }

        //copied from https://www.shadertoy.com/view/lt33z7
        vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
            vec3 N = estimateNormal(p);
            vec3 L = normalize(lightPos - p);
            vec3 V = normalize(eye - p);
            vec3 R = normalize(reflect(-L, N));

            float dotLN = dot(L, N);
            float dotRV = dot(R, V);

            if (dotLN < 0.0) {
                // Light not visible from this point on the surface
                return vec3(0.0, 0.0, 0.0);
            } 

            if (dotRV < 0.0) {
                // Light reflection in opposite direction as viewer, apply only diffuse
                // component
                return lightIntensity * (k_d * dotLN);
            }
            return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
        }

       vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
            const vec3 ambientLight = 0.8 * vec3(0.0, 1.0, 1.0);
            vec3 color = ambientLight * k_a;

            vec3 light1Pos = vec3(4.0 * sin(iTime),
                                  2.0,
                                  4.0 * cos(iTime));
            vec3 light1Intensity = vec3(.4, .4, .4);

            color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                          light1Pos,
                                          light1Intensity);

            vec3 light2Pos = vec3(2.0 * sin(0.37 * iTime),
                                  2.0 * cos(0.37 * iTime),
                                  2.0);
            vec3 light2Intensity = vec3(1.0, 0.5, 0.5);

            color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                          light2Pos,
                                          light2Intensity);    
            return color;
        }

        void main() {
            vec3 cam = vec3(0.0,0.0,50.0);
            vec3 dir = rayDirection(45.0, resolution, v_pos.xy);
            //vec3 eye = vec3(0.0, 0.0, 5.0);
    
            mat3 viewToWorld = rayMarchViewMatrix(cam, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
            vec3 worldDir = viewToWorld * dir;

            float dist = rayMarch(cam, worldDir, START, END);
            if(dist > END - EPSILON) {
                gl_FragColor = vec4(.2,1.5,0.9,0.0);
                return;
            }
            
            vec3 p = cam + dist * dir;
        
            vec3 K_a = vec3(0.0, 0.2, 0.2);
            vec3 K_d = vec3(0.0, 0.2, 0.2);
            vec3 K_s = vec3(0.0, 1.0, 0.5);
            float shininess = 10.0;

            vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, cam);

            gl_FragColor = vec4(color, 1.0);
            //gl_FragColor = vec4(1.0,0.0,0.0,0.0);
        }
    `;
