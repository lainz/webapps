angular.module('CuentasPersonales').service('bdMovimientos', function () {
    var db = new Dexie("cuentaspersonales");
    db.version(1).stores({
        movimientos: 'id,fecha,detalle,importe'
    });
    this.eliminarMovimiento = function (movimiento, f, e) {
        db.movimientos.delete(movimiento.id).then(function () {
            if (typeof f == "function") {
                f();
            }
        }).catch(function (error) {
            if (typeof e == "function") {
                e(error);
            }
        });
    }
    this.guardarMovimiento = function (movimiento, f, e) {
        db.movimientos.put(movimiento).then(function () {
            if (typeof f == "function") {
                f();
            }
        }).catch(function (error) {
            if (typeof e == "function") {
                e(error);
            }
        });
    }
    this.cargarMovimientos = function (orden, reversa, f, e) {
        if (reversa) {
            db.movimientos.orderBy(orden).reverse().toArray().then(function (array) {
                if (typeof f == "function") {
                    f(array);
                }
            }).catch(function (error) {
                if (typeof e == "function") {
                    e(error);
                }
            });
            return;
        }
        db.movimientos.orderBy(orden).toArray().then(function (array) {
            if (typeof f == "function") {
                f(array);
            }
        }).catch(function (error) {
            if (typeof e == "function") {
                e(error);
            }
        });
    }
});