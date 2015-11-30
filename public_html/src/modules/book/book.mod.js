(function (ng) {
    var mod = ng.module("bookModule", ["ui.bootstrap", "reviewModule", "authorModule", "editorialModule"]);

    mod.constant("bookContext", "http://localhost:8080/BookBasico.api/api/books");

})(window.angular);
