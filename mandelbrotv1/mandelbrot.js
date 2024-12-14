

var xOffset=0
var yOffset=0
var zoom=1

var dragStartX
var dragStartY
var isDragging = false


function setup() {
    createCanvas(360, 360);                         // set the size of the canvas
    pixelDensity(1)                                 // pixel density means that one pixel in the canvas is one pixel on the screen
    document.body.style.cursor = 'grab';

}

function draw() {
    var max_iterations = 100


    // Calculate bounds based on zoom and offsets
    var minval = -2.5 / zoom + xOffset;
    var maxval = 2.5 / zoom + xOffset;
    var minvalY = -2.5 / zoom + yOffset; // Adjust Y-axis independently
    var maxvalY = 2.5 / zoom + yOffset;

    loadPixels()                                    // we load the pixels and store them in variable "pixels"
    for (var x = 0; x < width; x++) {               // loop through all the pixels for the width
        for (var y = 0; y < height; y++) {          // loop through all the pixels for the height

            var a = map(x, 0, width, minval, maxval);
            var b = map(y, 0, height, minvalY, maxvalY);

            var ca = a
            var cb = b
            var iteration = 0
            for (iteration = 0; iteration < max_iterations; iteration++) {

                // the iterative formula is a^2 -b^2 + 2abi

                var aa = a * a - b * b      // first part
                var bb = 2 * a * b          // second part
                a = aa + ca                  // we set the new value of a
                b = bb + cb               // we set the new value of b

                if (a * a + b * b > 16) {     // if the value is greater than 16, we break the loop
                    break
                }


            }

            // map the iteration value to a brightness
            var bright = map(iteration, 0, max_iterations, 0, 1)
            bright = map(sqrt(bright), 0, 1, 0, 255)
            if (iteration == max_iterations) {
                bright = 0
            }


            var pix = (x + y * width) * 4;          // pix means the index of the pixel in the current row, we multiply by 4 because each pixel has 4 values (red, green, blue, alpha)
            pixels[pix + 0] = bright                // set the red value of the pixel
            pixels[pix + 1] = bright                // green
            pixels[pix + 2] = bright                // blue
            pixels[pix + 3] = 255                   //alpha



        }
    }
    updatePixels()
}

// Mouse wheel for zooming
function mouseWheel(event) {
    // Scale zoom based on wheel delta
    zoom *= event.delta > 0 ? 0.9 : 1.1;
    return false; // Prevent page scrolling
}


function mousePressed() {
    dragStartX = mouseX;
    dragStartY = mouseY;
    isDragging = true;
    document.body.style.cursor = 'grabbing';
}

function mouseReleased() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}

// Mouse dragged for panning
function mouseDragged() {
    if (isDragging) {
        // Calculate movement in screen space
        var dx = map(mouseX - dragStartX, 0, width, 0, 2.5 / zoom) - map(0, 0, width, 0, 2.5 / zoom);
        var dy = map(mouseY - dragStartY, 0, height, 0, 2.5 / zoom) - map(0, 0, height, 0, 2.5 / zoom);

        // Update offsets
        xOffset -= dx;
        yOffset -= dy;

        // Update drag start positions for smooth movement
        dragStartX = mouseX;
        dragStartY = mouseY;
    }
}