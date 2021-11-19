#version 300 es
precision mediump float;


// Passed in from the vertex shader
in vec3 v_color;
uniform vec3 viewPos;
uniform float Ka ;   // Ambient reflection coefficient
uniform float Kd ;   // Diffuse reflection coefficient
uniform float Ks ;   // Specular reflection coefficient

//uniform vec3 sunlightIntensity;

// Final color
out vec4 out_color;

void main() {

    vec3 ambientLightIntensity = vec3(0.2, 0.2, 0.5);
    vec3 sunlightIntensity = vec3(0.5, 0.5, 0.5);
    vec3 sunlightDirection = normalize(vec3(1.0, 4.0, -2.0));

    vec3 surfaceNormal = normalize(v_color);

    float diffuseStrength = max(dot(surfaceNormal, sunlightDirection), 0.0);
    vec3 diffuse = diffuseStrength * sunlightIntensity;

    vec4 texel = vec4(v_color, 1.0);

    vec3 lightIntensity = ambientLightIntensity + sunlightIntensity * max(dot(v_color, sunlightDirection), 0.0);

    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - v_color);
    vec3 reflectDir = reflect(-sunlightDirection, surfaceNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * sunlightIntensity;

    //out_color = vec4(v_color, 1.0);
    out_color = vec4(texel.rgb * (Ka * lightIntensity + Kd * diffuse + Ks * specular), texel.a);
    //gl_FragColor = vec4(v_color, 1.0);
}
