(function (ng) {

    var mainApp = ng.module("mainApp", [
        "authModule",
        "bookModule",
        "authorModule",
        "editorialModule",
        "ui.router"
    ]);

    mainApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/book");
            $stateProvider
                    .state('book', {
                        url: '/book',
                        templateUrl: "src/modules/book/book.tpl.html",
                        controller: "bookCtrl",
                        controllerAs: "ctrl"
                    })
                    .state('author', {
                        url: '/author',
                        templateUrl: "src/modules/author/author.tpl.html",
                        controller: "authorCtrl",
                        controllerAs: "ctrl"
                    })
                    .state('editorial', {
                        url: '/editorial',
                        templateUrl: "src/modules/editorial/editorial.tpl.html",
                        controller: "editorialCtrl",
                        controllerAs: "ctrl"
                    });
        }]);
    mainApp.config(["authServiceProvider", function (auth) {
            auth.setValues({
                apiUrl: "http://localhost:8080/BookBasico.api/api/users/",
                successPath: "/catalog",
                loginPath: "/login",
                registerPath: "/register",
                logoutRedirect: "/login",
                loginURL: "login",
                registerURL: "register",
                logoutURL: "logout",
                nameCookie: "userCookie"
            });
            //Registro de menus personalizados
            auth.setRoles({'user': [{id: 'registeredUsers', label: 'user', icon: 'list-alt', url: '#/author'}, {id: 'indexBook', label: 'book', icon: 'list-alt', url: '#/book'}],
                'provider': [{id: 'registeredProviders', label: 'provider', icon: 'inbox', url: '#/editorial'}]});
        }]);

    mainApp.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(true);
    }]);
})(window.angular);
