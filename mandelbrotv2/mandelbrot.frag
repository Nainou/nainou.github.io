precision mediump float;

uniform float u_zoom;
uniform float u_xOffset;
uniform float u_yOffset;
uniform vec2 u_resolution;
uniform float u_color_iteration;
uniform float u_hue;
uniform float u_saturation;
uniform float u_lightness;
uniform float u_r_value;
uniform float u_g_value;
uniform float u_b_value;

varying vec2 vTexCoord;

void main() {
    float aspectRatio = u_resolution.x / u_resolution.y;

    vec2 c = vec2(
        (vTexCoord.x - 0.5) * 4.0 / u_zoom * aspectRatio + u_xOffset,
        (vTexCoord.y - 0.5) * 4.0 / u_zoom + u_yOffset  // Map y coordinates similarly
    );

    vec2 z = c;
    int maxIterations = int(100.0);
    float smoothIteration = 0.0;

    for (int i = 0; i < 1000; i++) {
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (2.0 * z.x * z.y) + c.y;

        if (x * x + y * y > 4.0) {
            smoothIteration = float(i) + 1.0 - log(log(sqrt(x * x + y * y))) / log(2.0);
            break;
        }
        z = vec2(x, y);
    }

    if (smoothIteration == 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
         vec3 color = vec3(u_r_value, u_g_value, u_b_value);

        float hue = mod(u_hue + smoothIteration / float(maxIterations) * u_color_iteration, 1.0);
        float c = (1.0 - abs(2.0 * u_lightness - 1.0)) * u_saturation;
        float x = c * (1.0 - abs(mod(hue * 6.0, 2.0) - 1.0));
        float m = u_lightness - c / 2.0;
        vec3 hslColor = (hue < 1.0 / 6.0) ? vec3(c, x, 0.0) :
                        (hue < 2.0 / 6.0) ? vec3(x, c, 0.0) :
                        (hue < 3.0 / 6.0) ? vec3(0.0, c, x) :
                        (hue < 4.0 / 6.0) ? vec3(0.0, x, c) :
                        (hue < 5.0 / 6.0) ? vec3(x, 0.0, c) :
                                            vec3(c, 0.0, x);
        hslColor = hslColor + vec3(m);
        color.r = mix(color.r, hslColor.r, u_r_value);
        color.g = mix(color.g, hslColor.g, u_g_value);
        color.b = mix(color.b, hslColor.b, u_b_value);
        gl_FragColor = vec4(color, 1.0);
    }
}
