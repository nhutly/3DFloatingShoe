function setup() {
    var observerCanvas = document.getElementById('observerCanvas');
    var cameraCanvas = document.getElementById('cameraCanvas');
    var observerContext = observerCanvas.getContext('2d');
    var cameraContext = cameraCanvas.getContext('2d');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    // var slider2 = document.getElementById('slider2');
    // slider2.value = 0;
    var time = 0;
    var viewAval = 0;
    var pos1x = -300;
    var pos1y = -300;
    var pos2x = -300;
    var pos2y = -300;
    var reachMax = false;
    var thickness = 50;

    var context = cameraContext; // default to drawing in the camera window

    function draw() {

        // clear both canvas instances
        observerCanvas.width = observerCanvas.width;
        cameraCanvas.width = cameraCanvas.width;

        // use the sliders to get the angles
        var tParam = slider1.value * 0.01;
        var viewAngle = viewAval * 0.02 * Math.PI;
        // fill background 
        cameraContext.fillStyle = "rgba(0,0,0,.8)";
        cameraContext.rect(0, 0, cameraCanvas.width, cameraCanvas.height);
        cameraContext.fill();
        observerContext.fillStyle = "rgba(0,0,0,.8)";
        observerContext.rect(0, 0, observerCanvas.width, observerCanvas.height);
        observerContext.fill();

        // moves to a location with provided transform matrix
        function moveToTx(loc, Tx) {
            var res = vec3.create();
            vec3.transformMat4(res, loc, Tx);
            context.moveTo(res[0], res[1]);
        }

        // lines to a location with provided transform matrix
        function lineToTx(loc, Tx) {
            var res = vec3.create();
            vec3.transformMat4(res, loc, Tx);
            context.lineTo(res[0], res[1]);
        }

        // draws the object for travelling along the curve with provided scale and transform matrix
        function drawObject(color, TxU, scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx, Tx, [scale, scale, scale]);
            context.beginPath();
            context.fillStyle = color;
            moveToTx([-.05, -.05, 0], Tx);
            lineToTx([-.05, .05, 0], Tx);
            lineToTx([.05, .05, 0], Tx);
            lineToTx([.1, 0, 0], Tx);
            lineToTx([.05, -.05, 0], Tx);
            context.closePath();
            context.fill();
        }

        // draws cameara in the world coordinate with provided scale and transform matrix
        function drawCamera(color, TxU, scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx, Tx, [scale, scale, scale]);
            context.beginPath();
            context.strokeStyle = color;
            // Twelve edges of a cropped pyramid
            moveToTx([-3, -3, -2], Tx);
            lineToTx([3, -3, -2], Tx);
            lineToTx([3, 3, -2], Tx);
            lineToTx([-3, 3, -2], Tx);
            moveToTx([3, -3, -2], Tx);
            lineToTx([2, -2, 0], Tx);
            lineToTx([2, 2, 0], Tx);
            lineToTx([3, 3, -2], Tx);
            moveToTx([2, -2, 0], Tx);
            lineToTx([-2, -2, 0], Tx);
            lineToTx([-2, 2, 0], Tx);
            lineToTx([2, 2, 0], Tx);
            moveToTx([-2, -2, 0], Tx);
            lineToTx([-3, -3, -2], Tx);
            lineToTx([-3, 3, -2], Tx);
            lineToTx([-2, 2, 0], Tx);
            context.stroke();
        }

        // draws 3DAxes in the with provided scale and transform matrix
        function draw3DAxes(color, TxU, scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx, Tx, [scale, scale, scale]);

            context.strokeStyle = color;
            context.beginPath();
            // Axes
            moveToTx([1.2, 0, 0], Tx);
            lineToTx([0, 0, 0], Tx);
            lineToTx([0, 1.2, 0], Tx);
            moveToTx([0, 0, 0], Tx);
            lineToTx([0, 0, 1.2], Tx);
            // Arrowheads
            moveToTx([1.1, .05, 0], Tx);
            lineToTx([1.2, 0, 0], Tx);
            lineToTx([1.1, -.05, 0], Tx);
            moveToTx([.05, 1.1, 0], Tx);
            lineToTx([0, 1.2, 0], Tx);
            lineToTx([-.05, 1.1, 0], Tx);
            moveToTx([.05, 0, 1.1], Tx);
            lineToTx([0, 0, 1.2], Tx);
            lineToTx([-.05, 0, 1.1], Tx);
            // X-label
            moveToTx([1.3, -.05, 0], Tx);
            lineToTx([1.4, .05, 0], Tx);
            moveToTx([1.3, .05, 0], Tx);
            lineToTx([1.4, -.05, 0], Tx);
            // Y-label
            moveToTx([-.05, 1.4, 0], Tx);
            lineToTx([0, 1.35, 0], Tx);
            lineToTx([.05, 1.4, 0], Tx);
            moveToTx([0, 1.35, 0], Tx);
            lineToTx([0, 1.28, 0], Tx);
            // Z-label
            moveToTx([-.05, 0, 1.3], Tx);
            lineToTx([.05, 0, 1.3], Tx);
            lineToTx([-.05, 0, 1.4], Tx);
            lineToTx([.05, 0, 1.4], Tx);

            context.stroke();
        }

        // draws the UVWAxes of the camera with provided scale and transform matrix
        function drawUVWAxes(color, TxU, scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx, Tx, [scale, scale, scale]);

            context.strokeStyle = color;
            context.beginPath();
            // Axes
            moveToTx([1.2, 0, 0], Tx);
            lineToTx([0, 0, 0], Tx);
            lineToTx([0, 1.2, 0], Tx);
            moveToTx([0, 0, 0], Tx);
            lineToTx([0, 0, 1.2], Tx);
            // Arrowheads
            moveToTx([1.1, .05, 0], Tx);
            lineToTx([1.2, 0, 0], Tx);
            lineToTx([1.1, -.05, 0], Tx);
            moveToTx([.05, 1.1, 0], Tx);
            lineToTx([0, 1.2, 0], Tx);
            lineToTx([-.05, 1.1, 0], Tx);
            moveToTx([.05, 0, 1.1], Tx);
            lineToTx([0, 0, 1.2], Tx);
            lineToTx([-.05, 0, 1.1], Tx);
            // U-label
            moveToTx([1.3, .05, 0], Tx);
            lineToTx([1.3, -.035, 0], Tx);
            lineToTx([1.35, -.05, 0], Tx);
            lineToTx([1.4, -.035, 0], Tx);
            lineToTx([1.4, .05, 0], Tx);
            // V-label
            moveToTx([-.05, 1.4, 0], Tx);
            lineToTx([0, 1.3, 0], Tx);
            lineToTx([.05, 1.4, 0], Tx);
            // W-label
            moveToTx([-.1, 0, 1.3], Tx);
            lineToTx([-.05, 0, 1.4], Tx);
            lineToTx([-0, 0, 1.3], Tx);
            lineToTx([.05, 0, 1.4], Tx);
            lineToTx([.1, 0, 1.3], Tx);

            context.stroke();
        }

        // draws 2DAxes with transfrom matrix
        function draw2DAxes(color, Tx) {
            context.strokeStyle = color;
            context.beginPath();
            // Axes
            moveToTx([120, 0, 0], Tx);
            lineToTx([0, 0, 0], Tx);
            lineToTx([0, 120, 0], Tx);
            // Arrowheads
            moveToTx([110, 5, 0], Tx);
            lineToTx([120, 0, 0], Tx);
            lineToTx([110, -5, 0], Tx);
            moveToTx([5, 110, 0], Tx);
            lineToTx([0, 120, 0], Tx);
            lineToTx([-5, 110, 0], Tx);
            // X-label
            moveToTx([130, 0, 0], Tx);
            lineToTx([140, 10, 0], Tx);
            moveToTx([130, 10, 0], Tx);
            lineToTx([140, 0, 0], Tx);
            // Y-label
            moveToTx([0, 128, 0], Tx);
            lineToTx([5, 133, 0], Tx);
            lineToTx([10, 128, 0], Tx);
            moveToTx([5, 133, 0], Tx);
            lineToTx([5, 140, 0], Tx);
            context.stroke();
        }

        // draws up vector of the object in world coordinate
        function drawUpVector(color, vecUp, Tx) {
            context.strokeStyle = color;
            context.beginPath();
            // A single line segment in the "up" direction
            moveToTx([0, 0, 0], Tx);
            lineToTx(vecUp, Tx);
            context.stroke();
        }

        // our basis for Hermite
        var Hermite = function(t) {
            return [
                2 * t * t * t - 3 * t * t + 1,
                t * t * t - 2 * t * t + t, -2 * t * t * t + 3 * t * t,
                t * t * t - t * t
            ];
        }

        // our derivative for basis for Hermite
        var HermiteDerivative = function(t) {
            return [
                6 * t * t - 6 * t,
                3 * t * t - 4 * t + 1, -6 * t * t + 6 * t,
                3 * t * t - 2 * t
            ];
        }

        // building cubic function with provided basis and control points
        function Cubic(basis, P, t) {
            var b = basis(t);
            var result = vec3.create();
            vec3.scale(result, P[0], b[0]);
            vec3.scaleAndAdd(result, result, P[1], b[1]);
            vec3.scaleAndAdd(result, result, P[2], b[2]);
            vec3.scaleAndAdd(result, result, P[3], b[3]);
            return result;
        }

        // our control points for Hermite
        var p0 = [-100, -100, 0];
        var d0 = [-100, -300, 0];
        var p1 = [0, -80, 0];
        var d1 = [100, 175, 0];
        var p2 = [-100, -100, 0];
        var d2 = [0, 250, 0];

        var P0 = [p0, d0, p1, d1]; //   First two points and tangents
        var P1 = [p1, d1, p2, d2];

        var C0 = function(t_) { return Cubic(Hermite, P0, t_); }; // Cubic function for first piece of the curve
        var C1 = function(t_) { return Cubic(Hermite, P1, t_); }; // Cubic function for second piece of the curve

        var C0prime = function(t_) { return Cubic(HermiteDerivative, P0, t_); }; // Cubic function of the first tangent
        var C1prime = function(t_) { return Cubic(HermiteDerivative, P1, t_); }; // Cubic function of the second tangent

        // makes sure the t parameter in the (0,1) intervals for two pieces of the curve
        var Ccomp = function(t) {
            if (t < 1) {
                var u = t;
                return C0(u);
            } else {
                var u = t - 1.0;
                return C1(u);
            }
        }

        // makes sure the t parameter in the (0,1) intervals for two tangents of the curve
        var Ccomp_tangent = function(t) {
            if (t < 1) {
                var u = t;
                return C0prime(u);
            } else {
                var u = t - 1.0;
                return C1prime(u);
            }
        }

        // calculates the eye location of the camera with provided angle
        var CameraCurve = function(angle) {
            var distance = 120.0;
            var eye = vec3.create();
            eye[0] = distance * Math.sin(viewAngle);
            eye[1] = 100;
            eye[2] = distance * Math.cos(viewAngle);
            return [eye[0], eye[1], eye[2]];
        }

        // draws trajectory with given parameter
        function drawTrajectory(t_begin, t_end, intervals, C, Tx, color) {
            context.strokeStyle = color;
            context.beginPath();
            moveToTx(C(t_begin), Tx);
            for (var i = 1; i <= intervals; i++) {
                var t = ((intervals - i) / intervals) * t_begin + (i / intervals) * t_end;
                lineToTx(C(t), Tx);
            }
            context.stroke();
        }

        function drawShoes(Tx, z) {
            var p0 = [-100, -100, z];
            var d0 = [-100, -300, z];

            var p1 = [0, -80, z];
            var d1 = [100, 175, z];

            var p2 = [-100, -100, z];
            var d2 = [0, 250, z];

            var p3 = [0, 0, z]; //green start
            var d3 = [-100, -300, z];
            var d3c = [pos2x, pos2y, z];

            var p4 = [-300, -150, z]; //orange start
            var d4 = [-100, -200, z];

            var p5 = [100, -175, z]; //purple start
            var d5 = [100, 75, z];

            var p6 = [100, -50, z]; //red start
            var d6 = [-100, 0, z];

            var p7 = [5, -25, z]; //black start
            var d7 = [25, 100, z];

            var p8 = [0, 0, z]; //black end
            var d8 = [0, 0, z];

            var p9 = [100, -175, z]; //darkblue end
            var d9 = [0, -100, z];

            var p3c = [0, 0, 30 / 2]; //green start

            var d3c = [pos2x, pos2y, thickness / 2];
            var p10 = [(-200 + pos1x / 15), (0 + pos1x / 10), 30 / 2]; //end brown shoelace
            var d10 = [pos1x, pos1y, thickness / 2];

            var p11 = [-150, (pos1y / 10), 30 / 2]; //end maroon shoelace
            var d11 = [(pos1x / 2), (-pos1y / 2), 30 / 2];

            var P0 = [p0, d0, p1, d1]; //   First two points and tangents
            var P1 = [p1, d1, p2, d2];
            var P2 = [p3, d3, p4, d4]; //green curve
            var P3 = [p4, d4, p5, d5]; //orange curve
            var P4 = [p5, d5, p6, d6]; //purple curve
            var P5 = [p6, d6, p7, d7]; //red curve
            var P6 = [p7, d7, p8, d8]; //black curve
            var P7 = [p4, d4, p9, d9]; //darkblue cuve
            var P8 = [p3c, d3c, p10, d10]; //brown curve
            var P9 = [p3c, d3c, p11, d11]; //maroon curve

            var C0 = function(t_) { return Cubic(Hermite, P0, t_); }; // Cubic function for first piece of the curve
            var C1 = function(t_) { return Cubic(Hermite, P1, t_); }; // Cubic function for second piece of the curve
            var C2 = function(t_) { return Cubic(Hermite, P2, t_); };
            var C3 = function(t_) { return Cubic(Hermite, P3, t_); };
            var C4 = function(t_) { return Cubic(Hermite, P4, t_); };
            var C5 = function(t_) { return Cubic(Hermite, P5, t_); };
            var C6 = function(t_) { return Cubic(Hermite, P6, t_); };
            var C7 = function(t_) { return Cubic(Hermite, P7, t_); };
            var C8 = function(t_) { return Cubic(Hermite, P8, t_); };
            var C9 = function(t_) { return Cubic(Hermite, P9, t_); };

            var C0prime = function(t_) { return Cubic(HermiteDerivative, P0, t_); }; // Cubic function of the first tangent
            var C1prime = function(t_) { return Cubic(HermiteDerivative, P1, t_); }; // Cubic function of the second tangent

            cameraContext.lineWidth = 5.0;
            drawTrajectory(0.0, 1.0, 100, C0, Tx, "red");
            drawTrajectory(0.0, 1.0, 100, C1, Tx, "beige");
            drawTrajectory(0.0, 1.0, 100, C2, Tx, "green");
            drawTrajectory(0.0, 1.0, 100, C3, Tx, "orange");
            drawTrajectory(0.0, 1.0, 100, C4, Tx, "purple");
            drawTrajectory(0.0, 1.0, 100, C5, Tx, "blue");
            drawTrajectory(0.0, 1.0, 100, C6, Tx, "blue");
            drawTrajectory(0.0, 1.0, 100, C7, Tx, "blue");
            drawTrajectory(0.0, 1.0, 100, C8, Tx, "brown");
            drawTrajectory(0.0, 1.0, 100, C9, Tx, "maroon");

        }

        // create two lookAt transforms; one for the camera
        // and one for the "external observer"

        // Create Camera (lookAt) transform
        var eyeCamera = CameraCurve(viewAngle);
        // Creates a new vec3 initialized with the given values
        var targetCamera = vec3.fromValues(x = 0, y = 0, z = 0); // Aim at the origin of the world coords
        // Creates a new vec3 initialized with the given values
        var upCamera = vec3.fromValues(x = 0, y = 50, z = 0); // Y-axis of world coords to be vertical
        // Creates a new identity mat4
        var TlookAtCamera = mat4.create();
        // Generates a look-at matrix with the given eye position, focal point, and up axis.
        mat4.lookAt(out = TlookAtCamera, eye = eyeCamera, center = targetCamera, upvector = upCamera);

        // Create Observer (lookAt) transform
        // Creates a new vec3 initialized with the given values
        var eyeObserver = vec3.fromValues(x = 500, y = 300, z = 500);
        // Creates a new vec3 initialized with the given values
        var targetObserver = vec3.fromValues(x = 0, y = 50, z = 0); // Observer still looks at origin
        // Creates a new vec3 initialized with the given values
        var upObserver = vec3.fromValues(x = 0, y = 1, z = 0); // Y-axis of world coords to be vertical
        // Creates a new identity mat4
        var TlookAtObserver = mat4.create();
        // Generates a look-at matrix with the given eye position, focal point, and up axis.
        mat4.lookAt(out = TlookAtObserver, eye = eyeObserver, center = targetObserver, upvectore = upObserver);

        // Create ViewPort transform (assumed the same for both canvas instances)
        // Creates a new identity mat4
        var Tviewport = mat4.create();
        // Creates a matrix from a vector translation
        mat4.fromTranslation(out = Tviewport, translationVector = [observerCanvas.width / 2, 200, 0]); // Move the center of the
        // "lookAt" transform (where
        // the camera points) to the
        // canvas coordinates (350,350)
        // Scales the mat4 by the dimensions in the given vec3 not using vectorization
        mat4.scale(out = Tviewport, matrixToScale = Tviewport, vecToScaleBy = [150, -150, 1]); // Flip the Y-axis,
        // scale everything by 100x
        // make sure you understand these    

        context = cameraContext;

        // Create Camera projection transform
        // (orthographic for now)
        // Creates a new identity mat4
        var TprojectionCamera = mat4.create();
        // Generates a orthogonal projection matrix with the given bounds
        mat4.ortho(out = TprojectionCamera, left = -100, right = 100, bottom = -100, top = 100, near = -1, far = 1);
        //mat4.perspective(TprojectionCamera,Math.PI/4,1,-1,1); // Use for perspective teaser!

        // Create Observer projection transform
        // (orthographic for now)
        // Creates a new identity mat4
        var TprojectionObserver = mat4.create();
        // Generates a orthogonal projection matrix with the given bounds 
        mat4.ortho(out = TprojectionObserver, left = -120, right = 120, bottom = -120, top = 120, near = -1, far = 1);

        // Create transform t_VP_PROJ_CAM that incorporates
        // Viewport, projection and camera transforms
        // Creates a new identity mat4
        var tVP_PROJ_VIEW_Camera = mat4.create();
        // Multiplies two mat4s
        mat4.multiply(out = tVP_PROJ_VIEW_Camera, a = Tviewport, b = TprojectionCamera);
        mat4.multiply(out = tVP_PROJ_VIEW_Camera, a = tVP_PROJ_VIEW_Camera, b = TlookAtCamera);
        var tVP_PROJ_VIEW_Observer = mat4.create();
        mat4.multiply(out = tVP_PROJ_VIEW_Observer, a = Tviewport, b = TprojectionObserver);
        mat4.multiply(out = tVP_PROJ_VIEW_Observer, a = tVP_PROJ_VIEW_Observer, b = TlookAtObserver);

        // Create model(ing) transform
        // (from moving object to world)
        var Tmodel = mat4.create();
        // Creates a matrix from a vector translation
        mat4.fromTranslation(out = Tmodel, translationVector = Ccomp(tParam));
        var tangent = Ccomp_tangent(tParam);
        var angle = Math.atan2(tangent[1], tangent[0]);
        // Rotates a matrix by the given angle around the Z axis
        mat4.rotateZ(out = Tmodel, matrixToRotate = Tmodel, angleToRotateBy = angle);

        // Create transform t_VP_PROJ_VIEW_MOD that incorporates
        // Viewport, projection, camera, and modeling transform
        var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);
        var tVP_PROJ_VIEW_MOD1_Observer = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_MOD1_Observer, tVP_PROJ_VIEW_Observer, Tmodel);
        var tVP_PROJ_VIEW_MOD2_Observer = mat4.create();
        // Translates a mat4 by the given vector
        mat4.translate(out = tVP_PROJ_VIEW_MOD2_Observer, matrixToTranslate = tVP_PROJ_VIEW_Observer, vectorToTranslateBy = eyeCamera);
        var TlookFromCamera = mat4.create();
        // Inverts a mat4
        mat4.invert(out = TlookFromCamera, source = TlookAtCamera);
        mat4.multiply(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_MOD2_Observer, TlookFromCamera);

        // Draw the following in the Camera window
        context = cameraContext;
        draw2DAxes("black", mat4.create());
        draw3DAxes("grey", tVP_PROJ_VIEW_Camera, 100.0);
        drawUpVector("orange", upCamera, tVP_PROJ_VIEW_Camera, 1.0);
        for (let i = 0; i < thickness; i++) {
            drawShoes(tVP_PROJ_VIEW_Camera, i);
        }

        draw3DAxes("green", tVP_PROJ_VIEW_MOD_Camera, 100.0); // Uncomment to see "model" coords
        drawObject("green", tVP_PROJ_VIEW_MOD_Camera, 100.0);

        // Draw the following in the Observer window
        context = observerContext;
        draw3DAxes("grey", tVP_PROJ_VIEW_Observer, 100.0);
        // drawUpVector("orange",upCamera,tVP_PROJ_VIEW_Observer,1.0);

        // for (let i = 0; i < thickness; i += .75) {
        drawShoes(tVP_PROJ_VIEW_Observer, 0);
        // }

        drawObject("green", tVP_PROJ_VIEW_MOD1_Observer, 100.0);
        drawCamera("purple", tVP_PROJ_VIEW_MOD2_Observer, 10.0);
        drawUVWAxes("purple", tVP_PROJ_VIEW_MOD2_Observer, 100.0);

        // draw shoe back

        time = (time + 2) % 200;
        if (reachMax == false) {
            pos1x = pos1x + 5;
            pos1y = pos1y + 5;
            pos2x = pos2x + 2.5;
            pos2y = pos2y + 2.5;
        }
        if (pos1x >= 200 || reachMax == true) {
            reachMax = true;
            pos1x = pos1x - 5;
            pos1y = pos1y - 5;
            pos2x = pos2x - 2.5;
            pos2y = pos2y - 2.5;
        }
        if (pos1x <= -300) {
            reachMax = false;
        }
        viewAval = (viewAval + .05) % 100;
        window.requestAnimationFrame(draw);
    }

    // slider1.addEventListener("input", draw);
    // slider2.addEventListener("input", draw);
    draw();
}
window.onload = setup;