/*
 * Serve content over a socket
 */

var amqp = require('amqp');

var Bitlash = require('bitlash-commander/lib/bitlash.js');
var bitlash_options = {
        debug: true,
        echo: false,
        port: '/dev/tty.usbmodemfa131',
}

bitlash_options.baud = 57600;
var bitlash_ready = false;
var bitlash = new Bitlash.Bitlash(bitlash_options, function (readytext) {
  bitlash_ready = true;
})

function executeBitlash(data, callback) {
  console.log("EXECUTING...")
    if (bitlash.ready) {
        bitlash.exec(data.cmd + '\n', function(reply) {
            reply = reply.trim();
            if (reply && reply.length>0) {
                callback(reply)
                // executeBitlash(data, callback);
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
  socket.emit('bitlash:ready', { Ready: bitlash.ready })

  socket.emit('send:name', {
    name: 'Nat',
  });

  socket.emit('server:send:nat', {
    nat: 'ok'
  })

  var connection = amqp.createConnection({ host: 'nazt-pi.local' });
  var x;

  // Wait for connection to become established.
  connection.addListener('ready', function () {
      var q;
      console.log('queue ready')
      socket.emit('queue:ready', { ready: true })
      x = connection.exchange()
      // bind the queue
      q = connection.queue("pfio", { autoDelete: true, durable: false, exclusive: false });
      socket.on('client:pfio', function(data) {
        console.log('sending: ', data)
        x.publish('pfio', data.code);
        // x.publish('pfio2', "0001" , {deliveryMode: 2}, function(cb) {console.log("OOK") });
      });
  });


  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 5000);


};
