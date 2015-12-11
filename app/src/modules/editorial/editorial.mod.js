(function (ng) {
    var mod = ng.module("editorialModule", ["ui.bootstrap"]);

    mod.constant("editorialContext", "http://localhost:8080/BookBasico.api/api/editorials");
})(window.angular);
