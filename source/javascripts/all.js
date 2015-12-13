//= require jquery
//= require webcamjs
//= require materialize
//= require_tree .

$(document).ready(function(){
  var vid_width = 40;
  var vid_height = vid_width * 3 / 4;
  var pixel_size = 4;
  var active = false;
  var speed = 500;
  var tempImg = [];
  var canvas = $('#myCanvas')[0];
  var out_canvas = $('#outCanvas')[0];
  var context = canvas.getContext('2d');
  var img;
  var pixelData, average_color, padded, rand, sample_file, intrv;
  var images = [];
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  function drawVideo(){
    canvas = $('#myCanvas')[0];
    out_canvas = $('#outCanvas')[0];
    context = canvas.getContext('2d');
    Webcam.set({
      width: vid_width,
      height: vid_height,
      image_format: 'jpeg',
      jpeg_quality: 45,
      fps: 30
    });

    out_canvas.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(out_canvas, evt);
      console.log(parseInt(mousePos.y / pixel_size), parseInt(mousePos.x / pixel_size));
      image = images[(parseInt(mousePos.y / pixel_size) * pixel_size) + parseInt(mousePos.x / pixel_size)];
      $('.images img').removeClass('active');
      $(image).addClass('active');

    }, false);

    Webcam.attach( '.original' );
    setTimeout(function() {
      clearInterval(intrv);
      intrv = setInterval(take_snapshot, speed);
    }, 5000);
  }
  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
  function take_snapshot() {
    if(active) {
      canvas.width = vid_width;
      canvas.height = vid_height;
      out_canvas.width = vid_width * pixel_size;
      out_canvas.height = vid_height * pixel_size;

      Webcam.snap(function(data_uri, canvaz, context) {}, canvas);

      for (r = 0; r < vid_height; r++) {
        for (c = 0; c < vid_width; c++) {
          pixelData = context.getImageData(c, r, 1, 1).data;
          average_color = parseInt((pixelData[0] + pixelData[1] + pixelData[2]) / 3);
          padded = pad(average_color, 3);
          rand = Math.floor( (Math.random() * $('#sample-' + padded + ' ul li').length) + 1 );
          sample_file = $('#sample-' + padded + ' ul li:nth-child(' + rand +')').text();
          img = $('img[src="' + "/images/samples/" + padded + "/" + sample_file + '"]')[0];
          images.push(img);
          out_canvas.getContext('2d').drawImage(img, c * pixel_size, r * pixel_size, pixel_size, pixel_size);
        }
      }
   }
 }

  $('#play').on('change', function() {
    active = !active;
  });

  $('#speed').on('change', function() {
    speed = $(this).val();
    clearInterval(intrv);
    intrv = setInterval(take_snapshot, speed);
  });

  $('#size').on('change', function() {
    clearInterval(intrv);
    $('.result').html('<canvas width="' + + '" height="" class="hide" id="myCanvas"></canvas><canvas class="hide" id="outCanvas"></canvas>')
    vid_width = $(this).val();
    vid_height = parseInt(vid_width / 4 * 3);
    Webcam.reset();
    drawVideo();
  });

  $('#pixel').on('change', function() {
    pixel_size = $(this).val();
  });

  drawVideo();
});
