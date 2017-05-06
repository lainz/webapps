(function () {

    function save(filename, data) {
        var blob = new Blob([data], { type: 'text/csv' });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    var app = angular.module('Compras', []);

    app.directive('setFocus', function () {
        return {
            scope: { setFocus: '=' },
            link: function (scope, element) {
                element.ready(function () {
                    componentHandler.upgradeDom()
                });
                if (scope.setFocus) element[0].focus();
            }
        };
    });

    app.controller('ComprasController', function () {
        this.agregar = function () {
            this.items.push({ producto: "", precio: "", cantidad: 1 });
        }

        this.eliminar = function (index) {
            this.items.splice(index, 1);
            if (this.items.length == 0)
                this.agregar();
            this.procesar();
        }

        this.limpiar = function () {
            this.items = [{ producto: "", precio: "", cantidad: 1 }];
            this.procesar();
        }

        this.procesar = function (index) {
            let total = 0.0;
            this.items.forEach((item, index) => {
                return total += (item.precio * item.cantidad);
            })
            this.salida = total;
            localStorage.setItem("items", JSON.stringify(this.items));
        }

        this.descargar = function () {
            var out = this.items.map(function (obj) {
                return `"${obj.producto}","${obj.precio.toLocaleString()}","${obj.cantidad.toLocaleString()}"`
            });

            out.push(`"Total:","${this.salida.toLocaleString()}",""`);

            save("compras.csv", out.join("\n"));
        }

        let items = JSON.parse(localStorage.getItem("items"));

        if (items != null && items != undefined) {
            this.items = items;
        } else {
            this.items = [{ producto: "", precio: "", cantidad: 1 }]
        }

        this.procesar();
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () { console.log('Service Worker Registered'); });
    }
})();