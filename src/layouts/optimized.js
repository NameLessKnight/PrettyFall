export default function createOptimized(context) {
  return {
    stack: [],
    setup() {
      this.stack = [];
      for (let i = 0; i < context.numberOfColumns; i++) {
        this.stack.push([i, 0]);
      }
    },
    plot(itemIndex) {
      context.items[itemIndex][2] = (context.config.columnWidth) * this.stack[0][0];
      context.items[itemIndex][3] = this.stack[0][1];
      this.stack[0][1] += context.items[itemIndex][1];
      if (this.stack[0][1] > context.containerHeight) {
        context.containerHeight = this.stack[0][1];
      }
      this.stack.sort((a, b) => a[1] - b[1]);
      context.layout.columnPointer++;
      if (context.layout.columnPointer >= context.numberOfColumns) {
        context.layout.columnPointer = 0;
      }
    },
    loop() {
      for (let i = 0; i < context.items.length; i++) {
        this.plot(i);
      }
    }
  };
}
