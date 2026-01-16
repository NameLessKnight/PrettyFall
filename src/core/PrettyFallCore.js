import getSize from 'get-size';
import createOrdinal from '../layouts/ordinal.js';
import createOptimized from '../layouts/optimized.js';

class PrettyFall {
  constructor(properties = {}) {
    this.containerElement = undefined;
    this.itemElements = undefined;
    this.containerHeight = 0;
    this.containerWidth = 0;
    this.items = [];
    this.numberOfColumns = 0;
    this.boundary = { height: 0, width: 0 };
    this.resizeDebounceTimeout = undefined;
    this.config = {
      container: undefined,
      itemsSelector: undefined,
      boundary: window,
      createItem: function (data) {
        var item = document.createElement('div');
        item.className = 'grid-item panel panel-primary';
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

    this.resizeHandler = this.resizeHandler.bind(this);
    this.resizeComplete = this.resizeComplete.bind(this);

    // merge properties into config
    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        this.config[property] = properties[property];
      }
    }

    // create layout strategies bound to this context
    this.layout = {
      columnPointer: 0,
      ordinal: createOrdinal(this),
      optimized: createOptimized(this)
    };
  }

  initialize() {
    window.addEventListener('resize', this.resizeHandler);
    this.boundaryUpdate();
    this.updateSelectors();
    this.populateItems();
    this.updateNumberOfColumns();
    this.applyLayout();
  }

  boundaryUpdate() {
    const container = document.querySelector(this.config.container);
    const size = getSize(container);
    if (size) {
      this.boundary.width = size.width;
      this.boundary.height = size.height;
    }
  }

  resizeDebounce(fn, delay) {
    clearTimeout(this.resizeDebounceTimeout);
    this.resizeDebounceTimeout = window.setTimeout(fn, delay);
    return this.resizeDebounceTimeout;
  }

  resizeComplete() {
    if (this.config.isFluid) {
      this.numberOfColumns = this.calculateNumberOfColumns();
      return this.restack();
    }
  }

  resizeHandler() {
    this.updateData();
    this.boundaryUpdate();
    return this.resizeDebounce(this.resizeComplete, this.config.resizeDebounceDelay);
  }

  updateSelectors() {
    this.containerElement = this.config.container;
    this.itemElements = document.querySelectorAll(this.config.itemsSelector);
  }

  updateData() {
    const item = document.querySelector(this.config.itemsSelector);
    if (item) this.config.columnWidth = getSize(item).width;
  }

  appendItem(item) {
    this.config.columnWidth = getSize(item).width;
    return this.items.push([item, getSize(item).height, 0, 0]);
  }

  populateItems() {
    this.items = [];
    const ref = this.itemElements || [];
    for (let index = 0; index < ref.length; index++) {
      const item = ref[index];
      this.appendItem(item);
    }
  }

  calculateNumberOfColumns() {
    let numberOfColumns;
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
  }

  updateNumberOfColumns() {
    this.numberOfColumns = this.calculateNumberOfColumns();
    return this.numberOfColumns;
  }

  draw() {
    // compute target container width based on column count
    this.containerWidth = (this.config.columnWidth) * this.numberOfColumns;
    const height = this.containerHeight;
    const width = this.containerWidth;

    // attempt to detect width changes caused by scrollbar appearing/disappearing
    const containerEl = document.querySelector(this.config.container);
    const prevClientWidth = containerEl ? containerEl.clientWidth : null;

    const self = this;
    const callback = function () {};

    // scale the container then position items
    return this.config.scaleContainer(this.containerElement, width, height, function() {
      for (let index = 0; index < self.items.length; index++) {
        const item = self.items[index];
        self.config.moveItem(item[0], item[2], item[3], callback);
      }

      // run a microtask to check if clientWidth changed (e.g., scrollbar added)
      // if it changed we need to recalc columns and restack to avoid misalignment
      setTimeout(function() {
        try {
          const newClientWidth = containerEl ? containerEl.clientWidth : null;
          if (prevClientWidth && newClientWidth && newClientWidth !== prevClientWidth) {
            // update number of columns and re-layout
            self.updateNumberOfColumns();
            self.restack();
          }
        } catch (e) {
          // ignore measurement errors
        }
      }, 0);
    });
  }

  applyLayout() {
    this.layout[this.config.layout].context = this;
    this.layout[this.config.layout].setup();
    if (this.items.length) {
      return this.layout[this.config.layout].loop();
    }
  }

  resetLayout() {
    this.containerHeight = 0;
    this.layout.columnPointer = 0;
  }

  reset() {
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.items = [];
    this.updateSelectors();
    this.populateItems();
    this.resetLayout();
    this.restack();
  }

  append(data, callback) {
    const item = this.config.createItem(data);
    document.querySelector(this.containerElement).appendChild(item);
    const itemIndex = this.items.length;
    this.appendItem(item);
    if (this.calculateNumberOfColumns() === this.numberOfColumns) {
      this.layout[this.config.layout].plot(itemIndex);
      return this.draw();
    } else {
      return this.restack();
    }
  }

  restack() {
    this.updateNumberOfColumns();
    this.resetLayout();
    this.applyLayout();
    return this.draw();
  }
}

export default PrettyFall;
