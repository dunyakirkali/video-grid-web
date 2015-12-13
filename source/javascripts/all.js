//= require jquery
//= require webcamjs
//= require materialize
//= require_tree .

$(document).ready(function(){
  var vid_width = 80;
  var vid_height = vid_width * 3 / 4;
  var pixel_size = 5;
  var active = false;
  var speed = 500;
  var tempImg = [];
  var canvas = $('.result canvas')[0];
  var context = canvas.getContext('2d');
  var img = new Image();
  var pixelData, average_color, padded, rand, sample_file;

  function drawVideo(){
    canvas = $('.result canvas')[0];
    context = canvas.getContext('2d');

    for (r = 0; r < vid_height; r++) {
     $('.result').append( "<div class='row' id='row_" + r + "' style='height: 5px'></div>" );
     for (c = 0; c < vid_width; c++) {
       $('#row_' + r).append( "<span id='pixel_" + (r * vid_width) + c + "'></span>");
       var image = "<img width='" + pixel_size + "' height='" + pixel_size + "' src='images/samples/000/file.png'>";
       $('#pixel_' + (r * vid_width) + c).html(image);
     }
    }

   Webcam.set({
     width: vid_width,
     height: vid_height,
     image_format: 'jpeg',
     jpeg_quality: 45,
     fps: 30
   });
   Webcam.attach( '.original' );

  }

  drawVideo()

  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
  function take_snapshot() {
    if(active) {
      canvas.width = vid_width;
      canvas.height = vid_height;

      Webcam.snap(function(data_uri, canvaz, context) {}, canvas);

      for (r = 0; r < vid_height; r++) {
        for (c = 0; c < vid_width; c++) {
          pixelData = context.getImageData(c, r, 1, 1).data;
          average_color = parseInt((pixelData[0] + pixelData[1] + pixelData[2]) / 3);
          padded = pad(average_color, 3);
          rand = Math.floor( (Math.random() * $('#sample-' + padded + ' ul li').length) + 1 );
          sample_file = $('#sample-' + padded + ' ul li:nth-child(' + rand +')').text();
          $('#pixel_' + (r * vid_width) + c).find('img').attr('src', "images/samples/" + padded + "/" + sample_file)
        }
      }
   }
 }

  setTimeout(function() {
    setInterval(take_snapshot, speed);
  }, 5000);

  $('#play').on('change', function() {
    active = !active;
  });

  $('#pixel').on('change', function() {
    speed = $(this).val();
  });

  $('#size').on('change', function() {
    $('.result').html('<canvas class="hide" height="60" id="myCanvas" width="80"></canvas>')
    vid_width = $(this).val();
    vid_height = vid_width * 3 / 4;
    Webcam.reset();
    drawVideo();
  });

  $('#pixel').on('change', function() {
    pixel_size = $(this).val();

    for (r = 0; r < vid_height; r++) {
      for (c = 0; c < vid_width; c++) {
        $('#pixel_' + (r * vid_width) + c).find('img').attr('width', pixel_size).attr('height', pixel_size);
      }
      $('#row_' + r).css('height', pixel_size);
    }
  });
});
