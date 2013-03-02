/*
 * Serve content over a socket
 */

var amqp = require('amqp');

var Bitlash = require('bitlash-commander/lib/bitlash.js');
var bitlash_options = {
        debug: true,
        echo: false,
        port: '/dev/tty.usbmodemfd121',
}

bitlash_options.baud = 57600;
var bitlash_ready = false;
var bitlash = new Bitlash.Bitlash(bitlash_options, function (readytext) {
  bitlash_ready = true;
})

function executeBitlash(data, callback) {
    if (bitlash.ready) {
        bitlash.exec(data.cmd + '\n', function(reply) {
            reply = reply.trim();
            if (reply && reply.length>0) {
                callback(reply)
            }
            else {
              console.log("NO REPLY");
              callback (false);
            }
        });
    }
    else {
        callback(false);
        console.log('Bitlash not ready, dropping:', data);
    }
}

module.exports = function (socket) {
    setInterval(function() {
          socket.emit('bitlash:ready', { ready: bitlash.ready })
          executeBitlash({cmd: 'print get_temp()'}, function(res) {
            socket.emit('arduino:temperature', { data: res })
          })
    }, 1000)
    // if (bitlash.ready) {
    //   console.log(">>>>> EXECUTE BITLASH <<<<<<")
    //   executeBitlash({cmd: 'get_temp()'}, socket)
    // }


  console.log('>>>> EXPORT')

  socket.emit('send:name', {
    name: 'JJJ',
  });

  socket.emit('server:send:nat', {
    nat: 'ok'
  })

  var connection = amqp.createConnection({ host: 'localhost' });
  var x;

  // Wait for connection to become established.
  // connection.addListener('ready', function () {
  //     var q;
  //     console.log('>>>> ready')
  //     socket.emit('queue:ready', { ready: true })
  //     x = connection.exchange()
  //     q = connection.queue("pfio2", { autoDelete: true, durable: false, exclusive: false });
  //     x.publish('pfio2', "0001" , {deliveryMode: 2}, function(cb) {console.log("OOK") });
  // });

  // socket.on('client:command', function(data) {
  //   console.log('receive: ', data)
  // });

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 5000);


};
