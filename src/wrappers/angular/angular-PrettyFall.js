(function () {

    'use strict';

    angular.module('ngPrettyFall', [])
        .directive('ngPrettyFall', [ function (PrettyFall) {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {

                    var ngFall = new PrettyFall({
                        name: attrs['gridName'] || 'default',
                        container: attrs['itemContainer'] || '.grid-wrapper',
                        itemsSelector: attrs['itemSelector'] || '.grid-item',
                        isFluid: true,
                        createItem: function (data) {
                            var item = document.createElement('div');
                            item.className = "grid-item col-md-3 col-sm-6 col-xs-12";
                            item.innerHTML = '<div class="panel panel-primary"><div class="panel-heading"><h5 style="text-align: center;">' + data.animename + '</h5></div>' +
                                '<div class="panel-body"><img class="img-responsive center-block" src="' + data.imgpath + data.imgfilename + '"></div>' +
                                '<div class="panel-footer">' + data.description + '</div></div>';
                            return item;
                        },
                        moveItem: function (item, left, top, callback) {
                            angular.element(item).css("transform", "translate3d(" + left + "px, " + top + "px, 0px) scale3d(1, 1, 1)");
                            callback();
                        },
                        scaleContainer: function (container, width, height, callback) {
                            angular.element(container).css({height: height + "px"});
                            callback();
                        }
                    });
                    ngFall.initialize();

                    $scope.$on('$destroy', function () {
                        angular.element(window).unbind('resize', false);
                    });
                }
            }
        }]);
})();
