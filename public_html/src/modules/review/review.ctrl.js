(function (ng, Math) {
    var mod = ng.module('reviewModule');

    mod.controller('reviewCtrl', ['$scope', function ($scope) {
            $scope.currentRecord = {};
            $scope.records = [];
            $scope.refName = 'book';

            //Variables para el controlador
            this.readOnly = false;
            this.editMode = false;

            //Escucha de evento cuando se selecciona un registro maestro
            function onCreateOrEdit(event, args) {
                var childName = 'reviews';
                if (args[childName] === undefined) {
                    args[childName] = [];
                }
                $scope.records = args[childName];
                $scope.refId = args.id;
            }

            $scope.$on('post-create', onCreateOrEdit);
            $scope.$on('post-edit', onCreateOrEdit);

            //Función para encontrar un registro por ID o CID
            function indexOf(rc) {
                var field = rc.id !== undefined ? 'id' : 'cid';
                for (var i in $scope.records) {
                    if ($scope.records.hasOwnProperty(i)) {
                        var current = $scope.records[i];
                        if (current[field] === rc[field]) {
                            return i;
                        }
                    }
                }
            }

            this.fetchRecords = function () {
                $scope.currentRecord = {};
                this.editMode = false;
            };
            this.saveRecord = function () {
                var rc = $scope.currentRecord;
                if (rc.id || rc.cid) {
                    var idx = indexOf(rc);
                    $scope.records.splice(idx, 1, rc);
                } else {
                    rc.cid = -Math.floor(Math.random() * 10000);
                    rc[$scope.refName] = {id: $scope.refId};
                    $scope.records.push(rc);
                }
                this.fetchRecords();
            };
            this.deleteRecord = function (record) {
                var idx = indexOf(record);
                $scope.records.splice(idx, 1);
            };
            this.editRecord = function (record) {
                $scope.currentRecord = ng.copy(record);
                this.editMode = true;
            };
            this.createRecord = function () {
                this.editMode = true;
                $scope.currentRecord = {};
            };

            this.fetchRecords();
        }]);
})(window.angular, window.Math);
