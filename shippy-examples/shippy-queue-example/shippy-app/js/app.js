let app = angular.module('queueApp', []);

app.service('QueueService', function () {

	let randonNames = [
        'John Snow', 'Homer Simpson', 'Samus Aran', 'Daenerys Targerian', 'Patrick Kvothe', 'Nadine',
        'Ned Stark', 'Bart Simpson', 'Billy', 'The Grim Reaper', 'Foo', 'Bar'
    ];

	let randonIds = [
        'cs12311', 'cs12312', 'cs12313', 'cs12314', 'cs12315', 'cs12316',
        'cec5341', 'cec5342', 'cec5343', 'cec5344', 'cec5345', 'cec5346'
    ];

    this.getRandomPerson = function () {
        let name = randonNames[Math.floor(Math.random() * randonNames.length)];
        let id = randonIds[Math.floor(Math.random() * randonIds.length)];

        return {name: name, id: id};
    };

});

app.controller('QueueCtrl', ['$scope', 'QueueService', function ($scope, QueueService) {

	$scope.ta = false;

	$scope.me = QueueService.getRandomPerson();

    $scope.serverRunning = false;

	// This is the client data
	$scope.queue = [];
    $scope.state = {};

    $scope.isSuccessor = '-';
    $scope.clientID = '-';
	$scope.url = "#";

    $scope.add = function () {
	    $scope.me.data = Shippy.Util.randomPayload();
        Shippy.call("add", $scope.me);
    };

    $scope.remove = function () {
	    $scope.me.data = Shippy.Util.randomPayload();
        Shippy.call("remove", $scope.me);
    };

    // SHIPPY BOOTSTRAP

    $scope.updateQueue = function(state){
        $scope.queue = state.queue;
        $scope.state = JSON.stringify(state);
        $scope.isSuccessor = Shippy.internal.shouldBecomeNextServer().toString();
        $scope.clientID = Shippy.internal.clientId();

	    let url = Shippy.internal.currentFlywebService() ? Shippy.internal.currentFlywebService().serviceUrl : "#";

        console.log('AFTER SERVER UPDATE MY PWD IS', $scope.pwd);
        $scope.$apply();

        $scope.url = url;
	};



    let init = function(state) {
        state.queue = [];
	    Shippy.Util.log("init called. State is now...", state);
    };

    let operations = {
        add: function(state, params) {
            params.status = 'waiting';
	        let index = -1;
            for (let i = 0; i < state.queue.length; i++) {
                if (state.queue[i].id === params.id){
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                state.queue.push(params);
            }
        },
        remove: function(state, params) {
	        let index = -1;
            for (let i = 0; i < state.queue.length; i++) {
                if (state.queue[i].id === params.id){
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                state.queue.splice(index, 1);
            }
        }
    };

    Shippy.register("QueueApp", {
        init: init,
        operations: operations
    });

    // Whenever the state is updated, I want to update my UI
    Shippy.on("stateupdate", function(state) {
	    Shippy.Util.log("App event received: stateupdate");
        $scope.updateQueue(state);
    });

    // My app is now connected. Show a green box.
    Shippy.on("connect", function() {
	    Shippy.Util.log("App event received: connect");
        $scope.serverRunning = true;
	    $scope.$apply();

    });

    // My app is now disconnected. Show a red box.
    Shippy.on("disconnect", function(state) {
	    Shippy.Util.log("App event received: disconnect");
        $scope.serverRunning = false;
	    $scope.$apply();
    });
}]);