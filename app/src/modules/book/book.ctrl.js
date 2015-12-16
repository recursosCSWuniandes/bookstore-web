(function (ng) {
    var mod = ng.module("bookModule");

    mod.controller("bookCtrl", ["$scope", "bookService", "editorialService", "authorService", "$modal", function ($scope, svc, editorialSvc, authorSvc, $modal) {
        $scope.currentRecord = {};
        $scope.records = [];
        $scope.alerts = [];

        $scope.today = function () {
            $scope.value = new Date();
        };

        $scope.clear = function () {
            $scope.value = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        //Alertas
        this.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function showMessage(msg, type) {
            var types = ["info", "danger", "warning", "success"];
            if (types.some(function (rc) {
                return type === rc;
            })) {
                $scope.alerts.push({ type: type, msg: msg });
            }
        }

        this.showError = function (msg) {
            showMessage(msg, "danger");
        };

        this.showSuccess = function (msg) {
            showMessage(msg, "success");
        };

        var self = this;
        function responseError(response) {
            self.showError(response.data);
        }

        //Variables para el controlador
        this.readOnly = false;
        this.editMode = false;

        this.changeTab = function (tab) {
            $scope.tab = tab;
        };

        this.createRecord = function () {
            $scope.$broadcast("pre-create", $scope.currentRecord);
            this.editMode = true;
            $scope.currentRecord = {};
            $scope.$broadcast("post-create", $scope.currentRecord);
        };

        this.editRecord = function (record) {
            $scope.$broadcast("pre-edit", $scope.currentRecord);
            return svc.fetchRecord(record.id).then(function (response) {
                $scope.currentRecord = response.data;
                self.editMode = true;
                $scope.$broadcast("post-edit", $scope.currentRecord);
                return response;
            }, responseError);
        };

        this.fetchRecords = function () {
            return svc.fetchRecords().then(function (response) {
                $scope.records = response.data;
                $scope.currentRecord = {};
                self.editMode = false;
                ng.forEach(response.data, function (value) {
                    svc.getAuthors(value.id).then(function (response) {
                        value.authors = response.data;
                    });
                });
                return response;
            }, responseError);
        };
        this.saveRecord = function () {
            return svc.saveRecord($scope.currentRecord).then(function () {
                self.fetchRecords();
            }, responseError);
        };
        this.deleteRecord = function (record) {
            return svc.deleteRecord(record.id).then(function () {
                self.fetchRecords();
            }, responseError);
        };

        editorialSvc.fetchRecords().then(function (response) {
            $scope.editorials = response.data;
        });

        this.selectAuthors = function (book) {
            var modal = $modal.open({
                animation: true,
                templateUrl: "src/modules/book/authorModal.tpl.html",
                controller: ["$scope", "$modalInstance", "items", "currentItems", function ($scope, $modalInstance, items, currentItems) {
                    $scope.records = items.data;
                    $scope.allChecked = false;

                    function loadSelected(list, selected) {
                        ng.forEach(selected, function (selectedValue) {
                            ng.forEach(list, function (listValue) {
                                if (listValue.id === selectedValue.id) {
                                    listValue.selected = true;
                                }
                            });
                        });
                    }

                    loadSelected($scope.records, currentItems);

                    $scope.checkAll = function (flag) {
                        this.records.forEach(function (item) {
                            item.selected = flag;
                        });
                    };

                    function getSelectedItems() {
                        return $scope.records.filter(function (item) {
                            return !!item.selected;
                        });
                    }

                    $scope.ok = function () {
                        $modalInstance.close(getSelectedItems());
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss("cancel");
                    };
                }],
                resolve: {
                    items: function () {
                        return authorSvc.fetchRecords();
                    },
                    currentItems: function () {
                        return svc.getAuthors(book.id);
                    }
                }
            });
            modal.result.then(function (data) {
                svc.replaceAuthors(book.id, data).then(function () {
                    self.showSuccess("Autores actualizados");

                    svc.getAuthors(book.id).then(function (response) {
                        book.authors = response.data;
                    }, responseError);

                }, responseError);
            });
        };

        this.fetchRecords();
    }]);

    mod.controller("authorsCtrl", ["$scope", "authorService", "$modal", "bookService", function ($scope, svc, $modal, bookSvc) {
        $scope.currentRecord = {};
        $scope.records = [];
        $scope.refName = "authors";
        $scope.alerts = [];

        //Alertas
        this.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function showMessage(msg, type) {
            var types = ["info", "danger", "warning", "success"];
            if (types.some(function (rc) {
                return type === rc;
            })) {
                $scope.alerts.push({ type: type, msg: msg });
            }
        }

        this.showError = function (msg) {
            showMessage(msg, "danger");
        };

        var self = this;
        function responseError(response) {
            self.showError(response.data);
        }

        //Variables para el controlador
        this.readOnly = false;
        this.editMode = false;

        //Escucha de evento cuando se selecciona un registro maestro
        function onCreateOrEdit(event, args) {
            var childName = "authors";
            if (args[ childName ] === undefined) {
                args[ childName ] = [];
            }
            $scope.records = [];
            $scope.refId = args.id;
            bookSvc.getAuthors(args.id).then(function (response) {
                $scope.records = response.data;
            }, responseError);
        }

        $scope.$on("post-create", onCreateOrEdit);
        $scope.$on("post-edit", onCreateOrEdit);

        this.removeAuthor = function (index) {
            bookSvc.removeAuthor($scope.refId, $scope.records[ index ].id).then(function () {
                $scope.records.splice(index, 1);
            }, responseError);
        };
    }]);
})(window.angular);
