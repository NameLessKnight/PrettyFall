import getSize from 'get-size';

export default function createOrdinal(context) {
  return {
    stack: [],
    setup() {
      this.stack = [];
      for (let i = 0; i < context.numberOfColumns; i++) {
        this.stack.push(0);
      }
    },
    plot(itemIndex) {
      context.items[itemIndex][2] = (context.config.columnWidth) * context.layout.columnPointer;
      context.items[itemIndex][3] = this.stack[context.layout.columnPointer];
      this.stack[context.layout.columnPointer] += getSize(context.items[itemIndex][0]).height;
      const minIndex = this.stack.indexOf(Math.min.apply(null, this.stack));
      const maxIndex = this.stack.indexOf(Math.max.apply(null, this.stack));
      if (this.stack[maxIndex] > context.containerHeight) {
        context.containerHeight = this.stack[maxIndex];
      }
      context.layout.columnPointer = minIndex;
    },
    loop() {
      for (let i = 0; i < context.items.length; i++) {
        this.plot(i);
      }
    }
  };
}
