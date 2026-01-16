import PrettyFall from '../../PrettyFall.js';

export default {
  name: 'PrettyFallGrid',
  props: {
    items: { type: Array, default: () => [] },
    options: { type: Object, default: () => ({}) }
  },
  mounted() {
    const containerId = this.$el.id || ('prettyfall-' + Math.random().toString(36).slice(2, 9));
    this.$el.id = containerId;
    const selector = '#' + containerId + ' ' + (this.options.itemsSelector || '.grid-item');
    this.pf = new PrettyFall(Object.assign({}, this.options, {
      container: '#' + containerId,
      itemsSelector: selector,
      isFluid: this.options.isFluid !== undefined ? this.options.isFluid : true
    }));

    if (this.items && this.items.length) {
      this.$nextTick(() => {
        this.items.forEach(d => this.pf.append(d));
      });
    }

    this.pf.initialize();
  },
  beforeUnmount() {
    try { window.removeEventListener('resize', this.pf.resizeHandler); } catch (e) {}
  },
  render() {
    return null;
  }
}
