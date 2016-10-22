$(document).ready(function () {
  var socket = io();
  socket.on('mongoose:save', function (msg) {
    console.log(msg)
  })
  socket.on('mongoose:remove', function (msg) {
    console.log(msg)
  })
  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

});
