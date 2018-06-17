(function () {
    var bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    this.PrettyFall = (function () {
        PrettyFall.prototype.containerElement = void 0;
        PrettyFall.prototype.itemElements = void 0;
        PrettyFall.prototype.containerHeight = 0;
        PrettyFall.prototype.containerWidth = 0;
        PrettyFall.prototype.items = [];
        PrettyFall.prototype.numberOfColumns = 0;
        PrettyFall.prototype.boundary = {
            height: 0,
            width: 0
        };
        PrettyFall.prototype.resizeDebounceTimeout = void 0;
        PrettyFall.prototype.config = {
            container: void 0,
            itemsSelector: void 0,
            boundary: window,
            createItem: function (data) {
                var item = document.createElement('div');
                item.className = "grid-item panel panel-primary";
                item.innerHTML = '<div class="panel-heading"><h5 style="text-align: center;">' + data.animename + '</h5></div>' +
                    '<div class="panel-body"><img class="img-responsive center-block" src="' + data.imgpath + '"></div>' +
                    '<div class="panel-footer">' + data.description + '</div>';
                return item;
            },
            isFluid: false,
            layout: 'ordinal',
            numberOfColumns: 3,
            resizeDebounceDelay: 350,
            moveItem: function (item, left, top, callback) {
                item.style.left = left + 'px';
                item.style.top = top + 'px';
                return callback();
            },
            scaleContainer: function (container, width, height, callback) {
                container.style.height = height + 'px';
                container.style.width = width + 'px';
                return callback();
            }
        };

        function PrettyFall(properties) {
            this.resizeHandler = bind(this.resizeHandler, this);
            this.resizeComplete = bind(this.resizeComplete, this);
            var property, value;
            for (property in properties) {
                value = properties[property];
                this.config[property] = value;
            }
        };

        PrettyFall.prototype.initialize = function () {
            window.addEventListener('resize', this.resizeHandler);
            this.boundaryUpdate();
            this.updateSelectors();
            this.populateItems();
            this.updateNumberOfColumns();
            this.applyLayout();
            return this.draw();
        };

        PrettyFall.prototype.boundaryUpdate = function () {
            var container = document.querySelector(this.config.container);
            this.boundary.width = getSize(container).width;
            this.boundary.height = getSize(container).height;
            /* var horizontalPaddings, style, verticalPaddings;
            if (this.config.boundary !== window) {
                style = this.config.boundary.currentStyle || window.getComputedStyle(this.config.boundary);
                horizontalPaddings = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
                verticalPaddings = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
                this.boundary.height = this.config.boundary.offsetHeight - verticalPaddings;
                return this.boundary.width = this.config.boundary.offsetWidth - horizontalPaddings;
            } else {
                this.boundary.height = window.innerHeight;
                return this.boundary.width = window.innerWidth;
            }*/
        };

        PrettyFall.prototype.resizeDebounce = function (fn, delay) {
            clearTimeout(this.resizeDebounceTimeout);
            return this.resizeDebounceTimeout = window.setTimeout(fn, delay);
        };

        PrettyFall.prototype.resizeComplete = function () {
            if (this.config.isFluid) {
                this.numberOfColumns = this.calculateNumberOfColumns();
                return this.restack();
            }
        };

        PrettyFall.prototype.resizeHandler = function () {
            this.updateData();
            this.boundaryUpdate();
            return this.resizeDebounce(this.resizeComplete, this.config.resizeDebounceDelay);
        };

        PrettyFall.prototype.updateSelectors = function () {
            this.containerElement = this.config.container;
            return this.itemElements = document.querySelectorAll(this.config.itemsSelector);
        };

        PrettyFall.prototype.updateData = function () {
            var item = document.querySelector(this.config.itemsSelector);
            if (item) this.config.columnWidth = getSize(item).width;
        };
        PrettyFall.prototype.appendItem = function (item) {
            this.config.columnWidth = getSize(item).width;
            return this.items.push([item, getSize(item).height, 0, 0]);
        };

        PrettyFall.prototype.populateItems = function () {
            var index, item, j, len, ref, results;
            this.items = [];
            ref = this.itemElements;
            results = [];
            for (index = j = 0, len = ref.length; j < len; index = ++j) {
                item = ref[index];
                results.push(this.appendItem(item));
            }
            return results;
        };

        PrettyFall.prototype.calculateNumberOfColumns = function () {
            var numberOfColumns;
            if (this.config.isFluid) {
                numberOfColumns = Math.floor((this.boundary.width) / (this.config.columnWidth));
            } else {
                numberOfColumns = this.config.numberOfColumns;
            }
            if (numberOfColumns > this.items.length) {
                numberOfColumns = this.items.length;
            }
            if (this.items.length && numberOfColumns <= 0) {
                numberOfColumns = 1;
            }
            return numberOfColumns;
        };

        PrettyFall.prototype.updateNumberOfColumns = function () {
            return this.numberOfColumns = this.calculateNumberOfColumns();
        };

        PrettyFall.prototype.draw = function () {
            var height, width;
            this.containerWidth = (this.config.columnWidth) * this.numberOfColumns;
            height = this.containerHeight;
            width = this.containerWidth;
            return this.config.scaleContainer(this.containerElement, width, height, (function (_this) {
                return function () {
                    var callback, index, item, j, len, ref, results;
                    callback = function () {
                    };
                    ref = _this.items;
                    results = [];
                    for (index = j = 0, len = ref.length; j < len; index = ++j) {
                        item = ref[index];
                        results.push(_this.config.moveItem(item[0], item[2], item[3], callback));
                    }
                    return results;
                };
            })(this));
        };

        PrettyFall.prototype.layout = {
            columnPointer: 0,
            ordinal: {
                stack: [],
                setup: function () {
                    var i;
                    return this.stack = (function () {
                        var j, ref, ref1, results;
                        results = [];
                        for (i = j = 0, ref = this.context.numberOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                            results.push((ref1 = 0, i = ref1[0], ref1));
                        }
                        return results;
                    }).call(this);
                },
                plot: function (itemIndex) {
                    var context = this.context;
                    context.items[itemIndex][2] = (context.config.columnWidth) * context.layout.columnPointer;
                    context.items[itemIndex][3] = this.stack[context.layout.columnPointer];
                    //height auto
                    this.stack[context.layout.columnPointer] += getSize(context.items[itemIndex][0]).height;

                    //console.log(context.layout.columnPointer);
                    //console.log(this.stack[context.layout.columnPointer]);
                    //console.log(this.stack);

                    var minIndex = this.stack.indexOf(Math.min.apply(null, this.stack));
                    var maxIndex = this.stack.indexOf(Math.max.apply(null, this.stack));
                    if (this.stack[maxIndex] > context.containerHeight) {
                        context.containerHeight = this.stack[maxIndex];
                    }
                    return context.layout.columnPointer = minIndex;
                    /*if (this.stack[context.layout.columnPointer] > context.containerHeight) {
                        context.containerHeight = this.stack[context.layout.columnPointer];
                    }
                    context.layout.columnPointer++;
                    if (context.layout.columnPointer >= context.numberOfColumns) {
                        return context.layout.columnPointer = 0;
                    }*/
                },
                loop: function () {
                    var i, j, ref, results;
                    results = [];
                    for (i = j = 0, ref = this.context.items.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                        results.push(this.plot(i));
                    }
                    ;
                    return results;
                }
            },
            optimized: {
                stack: [],
                setup: function () {
                    var i;
                    return this.stack = (function () {
                        var j, ref, ref1, results;
                        results = [];
                        for (i = j = 0, ref = this.context.numberOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                            results.push((ref1 = [i, 0], i = ref1[0], ref1));
                        }
                        return results;
                    }).call(this);
                },
                plot: function (itemIndex) {
                    var context = this.context;
                    context.items[itemIndex][2] = (context.config.columnWidth) * this.stack[0][0];
                    context.items[itemIndex][3] = this.stack[0][1];
                    this.stack[0][1] += context.items[itemIndex][1];
                    if (this.stack[0][1] > context.containerHeight) {
                        context.containerHeight = this.stack[0][1];
                    }
                    this.stack.sort((function (a, b) {
                        return a[1] - b[1];
                    }));
                    context.layout.columnPointer++;
                    if (context.layout.columnPointer >= context.numberOfColumns) {
                        return context.layout.columnPointer = 0;
                    }
                },
                loop: function () {
                    var i, j, ref, results;
                    results = [];
                    for (i = j = 0, ref = this.context.items.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                        results.push(this.plot(i));
                    }
                    return results;
                }
            }
        };

        PrettyFall.prototype.applyLayout = function () {
            this.layout[this.config.layout].context = this;
            this.layout[this.config.layout].setup();
            if (this.items.length) {
                return this.layout[this.config.layout].loop();
            }
        };

        PrettyFall.prototype.resetLayout = function () {
            this.containerHeight = 0;
            return this.layout.columnPointer = 0;
        };

        PrettyFall.prototype.reset = function () {
            this.containerWidth = 0;
            this.containerHeight = 0;
            this.items = [];
            this.updateSelectors();
            this.populateItems();
            this.resetLayout();
            this.restack();
        };

        PrettyFall.prototype.append = function (data, callback) {
            var item = this.config.createItem(data);
            document.querySelector(this.containerElement).appendChild(item);
            var itemIndex;
            itemIndex = this.items.length;
            this.appendItem(item);
            if (this.calculateNumberOfColumns() === this.numberOfColumns) {
                this.layout[this.config.layout].plot(itemIndex);
                return this.draw();
            } else {
                return this.restack();
            }

        };

        PrettyFall.prototype.restack = function () {
            this.updateNumberOfColumns();
            this.resetLayout();
            this.applyLayout();
            return this.draw();
        };

        return PrettyFall;

    })();
}).call(this);