$(document).ready(function	(){

    var el;
    var options;
    var canvas;
    var span;
    var ctx;
    var radius;

    var createCanvasVariable = function(id){  // get canvas
        el = document.getElementById(id);
    };

    var createAllVariables = function(){
        options = {
            percent:  el.getAttribute('data-percent') || 25,
            size: el.getAttribute('data-size') || 165,
            lineWidth: el.getAttribute('data-line') || 15,
            rotate: el.getAttribute('data-rotate') || 0,
            color: el.getAttribute('data-color')
        };

        canvas = document.createElement('canvas');
        span = document.createElement('span');
        span.textContent = options.percent + '%';

        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }

        ctx = canvas.getContext('2d');
        canvas.width = canvas.height = options.size;

        el.appendChild(span);
        el.appendChild(canvas);

        ctx.translate(options.size / 2, options.size / 2); // change center
        ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

        radius = (options.size - options.lineWidth) / 2;
    };


    var drawCircle = function(color, lineWidth, percent) {
        percent = Math.min(Math.max(0, percent || 1), 1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.strokeStyle = color;
        ctx.lineCap = 'square'; // butt, round or square
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    };

    var drawNewGraph = function(id){
        el = document.getElementById(id);
        createAllVariables();
        drawCircle('#efefef', options.lineWidth, 100 / 100);
        drawCircle(options.color, options.lineWidth, options.percent / 100);


    };
    //drawNewGraph('graph1');
    //drawNewGraph('graph2');
    //drawNewGraph('graph3');
    //drawNewGraph('graph4');


});