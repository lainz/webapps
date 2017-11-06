angular.module('CuentasPersonales').service('date', function () {
    this.format = function (date) {
        var m = moment(date);
        m.locale(navigator.language);
        return m.isValid() ? m.format('L') : '';
    }
});

angular.module('CuentasPersonales').config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, 'L', true);
        m.locale(navigator.language);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdDateLocaleProvider.formatDate = function (date) {
        var m = moment(date);
        m.locale(navigator.language);
        return m.isValid() ? m.format('L') : '';
    };
});