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
  	socket.emit('client:command', { data: '0001' })
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
	$scope['outputs'] = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
	socket.emit('send:pfio', {
		code: '00001'
	})
}

function TempCtrl ($scope, socket) {
  socket.on('bitlash:ready', function(data) {
    console.log("BITLASH Ready", data.ready);
    $scope.ready = data.ready;
  });

  socket.on('arduino:temperature', function(data) {
    $scope.data = data;
    var splitted_data = data.data.split(',');
    $scope.temp = splitted_data[0]
    $scope.humid = splitted_data[1]
  })
  // body...
}