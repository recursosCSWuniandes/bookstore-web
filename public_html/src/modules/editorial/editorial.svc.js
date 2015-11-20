(function (ng) {
    var mod = ng.module('editorialModule');

    mod.service('editorialService', ['$http', 'editorialContext', function ($http, context) {
            /**
             * Obtener la lista de editorials.
             * Hace una petición GET con $http a /editorials para obtener la lista
             * de editorials
             * @returns {promise} promise para leer la respuesta del servidor.
             * Devuelve un array de objetos de editorial.
             */
            this.fetchRecords = function () {
                return $http.get(context);
            };

            /**
             * Obtener un registro de editorials.
             * Hace una petición GET a /editorials/:id para obtener
             * los datos de un registro específico de editorials
             * @param {number} id del registro a obtener
             * @returns {promise} promise para leer la respuesta del servidor
             * Devuelve un objeto de editorial.
             */
            this.fetchRecord = function (id) {
                return $http.get(context + "/" + id);
            };

            /**
             * Guardar un registro de editorials.
             * Si currentRecord tiene la propiedad id, hace un PUT a /editorials/:id con los
             * nuevos datos de la instancia de editorials.
             * Si currentRecord no tiene la propiedad id, se hace un POST a /editorials
             * para crear el nuevo registro de editorials
             * @param {object} currentRecord instancia de editorials a guardar/actualizar
             * @returns {promise} promise para leer la respuesta del servidor
             * Devuelve un objeto de editorial incluyendo su ID.
             */
            this.saveRecord = function (currentRecord) {
                if (currentRecord.id) {
                    return $http.put(context + "/" + currentRecord.id, currentRecord);
                } else {
                    return $http.post(context, currentRecord);
                }
            };

            /**
             * Hace una petición DELETE a /editorials/:id para eliminar un editorial
             * @param {number} id identificador de la instancia de editorial a eliminar
             * @returns {promise} promise para leer la respuesta del servidor
             * No devuelve datos.
             */
            this.deleteRecord = function (id) {
                return $http.delete(context + "/" + id);
            };

            /**
             * Hace una petición PUT a /editorials/:id/books para reemplazar los
             * book asociados a un editorial
             * @param {number} editorialId Identificador de la instancia de editorial
             * @param {array} books Colección de books nueva
             * @returns {promise} promise para leer la respuesta del servidor.
             * Devuelve el nuevo array de objetos de books
             */
            this.replaceBooks = function (editorialId, books) {
                return $http.put(context + "/" + editorialId + "/books", books);
            };

            /**
             * Hace una petición GET a /editorials/:id/books para obtener la colección
             * de book asociados a un editorial
             * @param {number} id Identificador de la instancia de editorial
             * @returns {promise} promise para leer la respuesta del servidor
             * Devuelve un array de objetos de books.
             */
            this.getBooks = function (id) {
                return $http.get(context + "/" + id + "/books");
            };

            /**
             * Hace una petición DELETE a /editorials/:id/books/:id para remover
             * un book de un editorial
             * @param {number} editorialId Identificador de la instancia de editorial
             * @param {number} bookId Identificador de la instancia de book
             * @returns {promise} promise para leer la respuesta del servidor
             * No devuelve datos.
             */
            this.removeBook = function (editorialId, bookId) {
                return $http.delete(context + "/" + editorialId + "/books/" + bookId);
            };

            /**
             * Hace una petición GET a /editorials/:id/authors para obtener la colección
             * de author asociados a un editorial
             * @param {number} id Identificador de la instancia de editorial
             * @returns {promise} promise para leer la respuesta del servidor
             * Devuelve un array de objetos de authors
             */
            this.getAuthors = function (id) {
                return $http.get(context + "/" + id + "/authors");
            };
        }]);
})(window.angular);