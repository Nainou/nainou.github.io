const home_button = document.getElementById('home-button');

let zoom = 1.5;
let xOffset = 0;
let yOffset = 0;

let shaderProgram;
let color_iteration_slider, hue_slider, saturation_slider, lightness_slider, r_slider, g_slider, b_slider;
let color_iteration_label, hue_label, saturation_label, lightness_label, r_label, g_label, b_label;

function preload() {
    shaderProgram = loadShader('mandelbrot.vert', 'mandelbrot.frag');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.style('z-index', '-1');
    noStroke();


    hue_slider = createSlider(0, 1, 0, 0.01);
    hue_slider.position(50, 10);
    hue_slider.style('width', '200px');
    hue_slider.input(() => updateLabel(hue_slider, hue_label, 'Hue: '));

    hue_label = createP('Hue: ' + hue_slider.value());
    hue_label.position(50, 20);

    saturation_slider = createSlider(0, 1, 1, 0.01);
    saturation_slider.position(250, 10);
    saturation_slider.style('width', '200px');
    saturation_slider.input(() => updateLabel(saturation_slider, saturation_label, 'Saturation: '));

    saturation_label = createP('Saturation: ' + saturation_slider.value());
    saturation_label.position(250, 20);

    lightness_slider = createSlider(0, 1, 0.5, 0.01);
    lightness_slider.position(450, 10);
    lightness_slider.style('width', '200px');
    lightness_slider.input(() => updateLabel(lightness_slider, lightness_label, 'Lightness: '));


    lightness_label = createP('Lightness: ' + lightness_slider.value());
    lightness_label.position(450, 20);

    r_slider = createSlider(0, 1, 1, 0.01);
    r_slider.position(650, 10);
    r_slider.style('width', '100px');
    r_slider.input(() => updateLabel(r_slider, r_label, 'Red: '));

    g_slider = createSlider(0, 1, 1, 0.01);
    g_slider.position(750, 10);
    g_slider.style('width', '100px');
    g_slider.input(() => updateLabel(g_slider, g_label, 'Green: '));

    b_slider = createSlider(0, 1, 1, 0.01);
    b_slider.position(850, 10);
    b_slider.style('width', '100px');
    b_slider.input(() => updateLabel(b_slider, b_label, 'Blue: '));

    r_label = createP('Red: ' + r_slider.value());
    r_label.position(650, 20);

    g_label = createP('Green: ' + g_slider.value());
    g_label.position(750, 20);

    b_label = createP('Blue: ' + b_slider.value());
    b_label.position(850, 20);

    color_iteration_slider = createSlider(0, 10, 0.5, 0.01);
    color_iteration_slider.position(950, 10);
    color_iteration_slider.style('width', '200px');
    color_iteration_slider.input(() => updateLabel(color_iteration_slider, color_iteration_label, 'Color iteration: '));

    color_iteration_label = createP('Color iteration: ' + color_iteration_slider.value());
    color_iteration_label.position(950, 20);

    randomize_button = createButton('Randomize');
    randomize_button.html('<span class="button_top">Randomize</span>');
    randomize_button.position(1160, 10);
    randomize_button.mousePressed(() => {
        hue_slider.value(random());
        r_slider.value(random());
        g_slider.value(random());
        b_slider.value(random());
    });

    // Hide sliders initially
    hideSliders();
}

function updateLabel(slider, label, text) {
    label.html(text + slider.value());
}

function draw() {
    shader(shaderProgram);

    // Pass uniform variables to the shader
    shaderProgram.setUniform('u_zoom', zoom);
    shaderProgram.setUniform('u_xOffset', xOffset);
    shaderProgram.setUniform('u_yOffset', yOffset);
    shaderProgram.setUniform('u_resolution', [width, height]);
    shaderProgram.setUniform('u_color_iteration', color_iteration_slider.value());
    shaderProgram.setUniform('u_hue', hue_slider.value());
    shaderProgram.setUniform('u_saturation', saturation_slider.value());
    shaderProgram.setUniform('u_lightness', lightness_slider.value());
    shaderProgram.setUniform('u_r_value', r_slider.value());
    shaderProgram.setUniform('u_g_value', g_slider.value());
    shaderProgram.setUniform('u_b_value', b_slider.value());

    quad(-1, -1, 1, -1, 1, 1, -1, 1);

    // Show or hide sliders based on mouse position
    if (mouseY < 80) {
        showSliders();
    } else {
        hideSliders();
    }
}

function hideSliders() {
    color_iteration_slider.hide();
    color_iteration_label.hide();
    hue_slider.hide();
    hue_label.hide();
    saturation_slider.hide();
    saturation_label.hide();
    lightness_slider.hide();
    lightness_label.hide();
    r_slider.hide();
    r_label.hide();
    g_slider.hide();
    g_label.hide();
    b_slider.hide();
    b_label.hide();
    home_button.style.display = 'none';
    randomize_button.hide();
}

function showSliders() {
    color_iteration_slider.show();
    color_iteration_label.show();
    hue_slider.show();
    hue_label.show();
    saturation_slider.show();
    saturation_label.show();
    lightness_slider.show();
    lightness_label.show();
    r_slider.show();
    r_label.show();
    g_slider.show();
    g_label.show();
    b_slider.show();
    b_label.show();
    home_button.style.display = 'block';
    randomize_button.show();
}

// Mouse wheel for zooming
function mouseWheel(event) {
    zoom *= event.delta > 0 ? 0.9 : 1.1;
}

// Mouse dragging for panning
function mouseDragged() {
    if (mouseY > 80) {
        xOffset -= (mouseX - pmouseX) / (width * zoom) * 6.0;
        yOffset += (mouseY - pmouseY) / (height * zoom) * 3.0;
    }
}

function mousePressed() {
    if (mouseY > 80) {
        document.body.style.cursor = 'grabbing';
    }
}

function mouseReleased() {
    document.body.style.cursor = 'grab';
}

// Adjust canvas size when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
