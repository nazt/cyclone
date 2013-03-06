'use strict';

/* Controllers */

function AppCtrl($scope, socket, $window) {
  $window.console.log('nat')
  socket.on('send:name', function (data) {
    $scope.name = data.name;
  });

  socket.on('queue:ready', function (data) {
  	$window.console.log("queue is ready.")
  	$window.console.log(data);
  	// socket.emit('client:command', { data: '0001' })
  });
}

function MyCtrl1($scope, socket) {
  socket.on('send:time', function (data) {
    $scope.time = data.time;

  });
}
MyCtrl1.$inject = ['$scope', 'socket'];


function MyCtrl2(socket) {
  	socket.emit('client:command', { data: '0001' })
}
MyCtrl2.$inject = ['socket'];

function PfioCtrl($scope, socket, $window) {
  $scope.code = '00000000';
	$scope['outputs'] = [ { pin: 1, on: false }, { pin: 2, on: false },
    { pin: 3, on: false }, { pin: 4, on: false },
    { pin: 5, on: false }, { pin: 6, on: false }, { pin: 7, on: false }, { pin: 8, on: false }
  ]


  $scope.click = function (port) {
    var index = port.pin - 1;
    var cached_port = $scope.outputs[index]

    cached_port['on'] = !cached_port['on'];

    // var bin = Number.prototype.toString.apply(index, [2, 3])
    var mapped = _.map($scope.outputs, function(obj) {
      return obj.on && 1 || 0
    })
    $scope.code = mapped.join('');
    $scope.codeHex = Number.prototype.toString.call(parseInt($scope.code.split('').reverse().join(''), 2), 16)

    console.log("Emitting: ", $scope.codeHex)
  	socket.emit('client:pfio', {
  		code: $scope.codeHex
  	})

    // body...
  }

  $scope.status = { false: 'Off', true: 'On' }
  $scope.classes = { true: 'btn-success', false: '' }
}

function TempCtrl ($scope, socket) {
  $scope.ready = 'false';
  $scope.temp = 'null';
  $scope.humid = 'null';
  $scope.cls = { true: 'btn-success', false: '' }
  $scope.buttons = {
      b1: { label: 'B1' },
      b2: { label: 'B2' }
  }

  socket.on('bitlash:ready', function(data) {
    console.log("BITLASH Ready", data.ready);
    // String.prototype.toString.apply(data.ready, [])
  });

  socket.on('arduino:temperature', function(data) {
    var splitted_data;

    $scope.data = data;
    $scope.temp = 'null';
    $scope.humid = 'null';

    if ($scope.ready) {
      splitted_data = data.data.split(',');
      $scope.temp = splitted_data[0]
      $scope.humid = splitted_data[1]
    }
    else {
      console.log("But not ready", data)
    }
  })

  $scope.$watch('radioValue', function(newVal, oldVal) {
    console.log("CHANG", newVal, "->", oldVal )
  })

  $scope.$watch('typingText', function (newVal, oldVal) {
    console.log("CHANG", newVal, "->", oldVal )
  })
  // body...
}