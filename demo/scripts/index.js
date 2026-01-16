var title = new Vue({
    el: '#title',
    data: {
        title:'PrettyFall'
    }
});

var ngFall = new PrettyFall({
    name: 'default',
    container: '.grid-wrapper',
    itemsSelector: '.grid-item',
    isFluid: true,
    createItem: function (data) {
        var item = document.createElement('div');
        item.className = "grid-item col-md-3 col-sm-6 col-xs-12";
        item.innerHTML = '<div class="panel panel-primary"><div class="panel-heading"><h5 style="text-align: center;">' + data.title + '</h5></div>' +
            '<div class="panel-body"><img class="img-responsive center-block" src="' + data.url+ '"></div>' +
            '<div class="panel-footer">' + data.summary + '</div></div>';
        return item;
    },
    moveItem: function (item, left, top, callback) {
        $(item).css("transform", "translate3d(" + left + "px, " + top + "px, 0px) scale3d(1, 1, 1)");
        callback();
    },
    scaleContainer: function (container, width, height, callback) {
        $(container).css({height: height + "px"});
        callback();
    }
});

var waterFall = new Vue({
    el: '#PrettyFall',
    data: {
        title:'PrettyFall'
    },
    methods: {
        init: function(){
            ngFall.initialize();
        },
        addItems: function () {
            $.get("images.json",function(data,status){
                            // Use bundled ImageLoader exposed via PrettyFall
                            if (typeof PrettyFall === 'undefined' || !PrettyFall.ImageLoader) {
                                console.error('PrettyFall.ImageLoader not available. Ensure dist/prettyfall.umd.js is loaded before index.js');
                                return;
                            }
                            var imageLoader = new PrettyFall.ImageLoader();
                            data.results.forEach(function (item) {
                                imageLoader.get(item.url, function () {
                                    ngFall.append(item);
                                });
                            });
            });
        }
    },
    mounted:function () {
        this.init();
        this.addItems();
    }
});