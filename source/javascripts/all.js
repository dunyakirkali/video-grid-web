//= require jquery
//= require webcamjs
//= require materialize
//= require_tree .

$(document).ready(function(){
  var vid_width = 64;
  var vid_height = vid_width * 3 / 4;
  var pixel_size = 5;
  var active = false;
  var speed = 500;
  var tempImg = [];

  // for (c = 0; c < 256; c++) {
  //   tempImg[c] = [];
  //   $('#samlpe-' + pad(c, 3) + ' .item').each(function(index) {
  //     tempImg[c][index] = new Image();
  //     tempImg[c][index].src = $(this).text();
  //   });
  // }

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
     jpeg_quality: 90
   });
   Webcam.attach( '.original' );

  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
  function take_snapshot() {
    if(active) {
      Webcam.snap(function(data_uri) {
        // $('.transposed').html('<img src="' + data_uri + '"/>')
        var canvas = $('.result canvas')[0];
        var context = canvas.getContext('2d');
        var img = new Image();
        var pixelData, average_color, padded, rand, sample_file;

        img.onload = function () { context.drawImage(img, 0, 0); };
        img.src = data_uri;

        canvas.width = vid_width;
        canvas.height = vid_height;
        context.drawImage(img, 0, 0, img.width, img.height);

        for (r = 0; r < vid_height; r++) {
          for (c = 0; c < vid_width; c++) {
            pixelData = canvas.getContext('2d').getImageData(c, r, 1, 1).data;
            average_color = parseInt((pixelData[0] + pixelData[1] + pixelData[2]) / 3);
            padded = pad(average_color, 3);
            rand = Math.floor( (Math.random() * $('#sample-' + padded + ' ul li').length) + 1 );
            sample_file = $('#sample-' + padded + ' ul li:nth-child(' + rand +')').text();
            $('#pixel_' + (r * vid_width) + c).find('img').attr('src', "images/samples/" + padded + "/" + sample_file)
          }
        }
     });
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
