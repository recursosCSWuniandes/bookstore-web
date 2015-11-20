(function (ng) {
    var mod = ng.module("bookModule", ["ui.bootstrap", "reviewModule", "authorModule", "editorialModule"]);

    mod.constant("bookContext", "api/books");

})(window.angular);
