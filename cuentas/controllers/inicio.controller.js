angular.module('CuentasPersonales').controller('InicioController', function (bdMovimientos, uuid, $scope, date) {
    this.titulo = "Cuentas Personales";
    this.filtros = [{ id: 0, nombre: "Todo" }, { id: 1, nombre: "Egresos" }, { id: 2, nombre: "Ingresos" }];
    this.tipoMovimiento = [{ valor: true, nombre: "Egreso" }, { valor: false, nombre: "Ingreso" }];
    this.ordenarPor = [{ valor: "fecha", nombre: "Fecha" }, { valor: "detalle", nombre: "Detalle" }, { valor: "importe", nombre: "Importe" }]
    this.filtro = "0";
    this.orden = "fecha";
    this.reversa = false;
    this.recargar = function () {
        bdMovimientos.cargarMovimientos(this.orden, this.reversa, (array) => {
            this.movimientos = array;
            this.filtrar();
            $scope.$digest()
        });
    }
    this.filtrar = function () {
        this.totalEgresos = 0;
        this.totalIngresos = 0;
        this.movimientosFiltrados = [];
        var buscar = (this.buscar) ? this.buscar.toLowerCase().split(" ") : [];
        var filtro = this.filtro;
        this.movimientos.forEach((movimiento, index, array) => {
            var mostrar = false;
            switch (filtro) {
                case "0": {
                    mostrar = true;
                    break;
                }
                case "1": {
                    mostrar = movimiento.importe < 0;
                    break;
                }
                case "2": {
                    mostrar = movimiento.importe >= 0;
                    break;
                }
            }
            if (mostrar) {
                for (var j=0; j<buscar.length; j++) {
                    mostrar = (movimiento.detalle.toLowerCase().indexOf(buscar[j]) != -1 || this.formatoFecha(movimiento.fecha).indexOf(buscar[j]) != -1 || this.formatoNumero(movimiento.importe) == buscar[j])
                    if (!mostrar)
                      break;
                }
                if (mostrar) {
                    this.movimientosFiltrados.push(movimiento);
                    if (movimiento.importe < 0) {
                        this.totalEgresos = this.totalEgresos + movimiento.importe;
                    } else {
                        this.totalIngresos = this.totalIngresos + movimiento.importe;
                    }
                }
            }
        });
        this.totalSaldo = this.totalEgresos + this.totalIngresos;
    }
    this.editar = function (movimiento) {
        this.movimiento = angular.copy(movimiento);
        this.movimiento.gasto = "false";
        if (this.movimiento.importe < 0) {
            this.movimiento.importe = -this.movimiento.importe;
            this.movimiento.gasto = "true";
        }
        this.modoEdicion = true;
    }
    this.guardar = function () {
        var mov = angular.copy(this.movimiento);
        if (mov.gasto == "true") {
            mov.importe = -mov.importe;
        }
        delete mov.gasto;
        bdMovimientos.guardarMovimiento(mov, () => {
            this.recargar();
            this.modoEdicion = false;
        }, function (error) {
        });
    }
    this.cancelar = function () {
        this.modoEdicion = false;
    }
    this.nuevo = function () {
        this.movimiento = {
            id: uuid.generar(),
            fecha: new Date(),
            gasto: "true"
        }
        $scope.projectForm.$setUntouched();
        $scope.projectForm.$setPristine();
        this.modoEdicion = true;
    }
    this.eliminar = function (movimiento) {
        bdMovimientos.eliminarMovimiento(movimiento, () => {
            this.recargar();
        });
    }
    this.formatoFecha = function (fecha) {
        return date.format(fecha);
    }
    this.formatoNumero = function (numero) {
        return numero ? Intl.NumberFormat(["es-Ar", navigator.language]).format(numero) : "";
    }
    this.formatoMonetario = function (numero) {
        return numero ? Intl.NumberFormat(["es-Ar", navigator.language], { style: 'currency', currency: 'ARS', currencyDisplay: 'symbol' }).format(numero) : "";
    }
    this.descargarExcel = function () {
        /* generate a worksheet */
        var mov = angular.copy(this.movimientosFiltrados);
        mov.forEach((movimiento) => {
            delete movimiento.id;
        });
        mov.push({
            fecha: "",
            detalle: "Total Ingresos",
            importe: this.totalIngresos,
        })
        mov.push({
            fecha: "",
            detalle: "Total Egresos",
            importe: this.totalEgresos,
        })
        mov.push({
            fecha: "",
            detalle: "Saldo",
            importe: this.totalSaldo,
        })
        var ws = XLSX.utils.json_to_sheet(mov);

        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Movimientos");

        /* write workbook (use type 'binary') */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        /* generate a download */
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "movimientos " + new Date().toLocaleString(navigator.language) + ".xlsx");
    }
    this.imprimir = function() {
        window.print();
    }
    this.recargar();
    /*var j = 0;
    for (var i=0; i<1000; i++) {
        bdMovimientos.guardarMovimiento({id: uuid.generar(), fecha: new Date(), detalle: "Test " + i, importe: Math.random() * 100}, () => {
            j++;
            if (j == 999)
                alert('finish')
        });
    }*/
});