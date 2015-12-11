(function (ng) {
    var mod = ng.module("authorModule", ["ui.bootstrap"]);

    mod.constant("authorContext", "http://localhost:8080/BookBasico.api/api/authors");
})(window.angular);
