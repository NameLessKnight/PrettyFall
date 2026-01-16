# PrettyFall

轻量级的瀑布流 / 网格布局库，带有 React / Vue / Angular 的封装适配器。

本仓库实现了一个可配置的前端布局引擎 `PrettyFall`，可以在原生 DOM 环境中使用，也提供了 `wrappers` 目录下的框架适配组件以便在常见前端框架中快速集成。

**Features**
- 支持流式（fluid）和固定列数布局
- 可定制的元素创建、移动与容器缩放回调
- 小巧、无外部依赖（除 `get-size`），易于集成
- 提供 `ImageLoader` 简单的图片预加载工具
- 包含 `React`、`Vue`、`Angular` 的使用封装（位于 `src/wrappers`）

**安装**
- 从 npm（若已发布）：

	```bash
	npm install prettyfall
	# 或
	yarn add prettyfall
	```

- 本地开发 / 构建：

	```powershell
	npm install
	npm run build
	npm start    # 启动 demo（使用 sirv）
	```

**快速开始（浏览器 / UMD）**
- 使用打包后的 UMD 文件（`dist/prettyfall.umd.js`）会把 `PrettyFall` 和 `ImageLoader` 挂载到 `window`：

	```html
	<script src="dist/prettyfall.umd.js"></script>
	<script>
		const pf = new PrettyFall({
			container: '.grid-wrapper',
			itemsSelector: '.grid-item',
			numberOfColumns: 3,
			isFluid: false
		});

		pf.initialize();

		// 添加项（示例数据字段会被默认 createItem 使用）
		pf.append({ animename: '示例', imgpath: '/images/foo.jpg', description: '说明' });
	</script>
	```

**ESM / 模块用法**

```js
import PrettyFall, { ImageLoader } from 'prettyfall';

const pf = new PrettyFall({ container: '#grid', itemsSelector: '#grid .grid-item' });
pf.initialize();

// 使用 ImageLoader 预加载图片
const loader = new ImageLoader();
loader.get('/path/to/img.jpg', (props) => {
	// props: { url, height, width, ratio }
	pf.append({ animename: 'Name', imgpath: props.url, description: '...' });
});
```

**主要 API 与配置项**
- 构造函数接收一个配置对象（常用字段）：
	- `container`：必填，容器选择器字符串（如 `#grid` 或 `.grid-wrapper`）。
	- `itemsSelector`：必填，子项选择器（如 `.grid-item`）。
	- `boundary`：测量边界（默认 `window`）。
	- `createItem(data)`：函数，接收数据返回 DOM 节点（库提供了一个默认实现）。
	- `isFluid`：布尔，是否流式布局（基于子项宽度自适应列数）。
	- `layout`：布局算法名字，默认 `'ordinal'`（其他可用 `'optimized'`）。
	- `numberOfColumns`：固定列数（当 `isFluid: false` 时使用）。
	- `resizeDebounceDelay`：窗口 resize 防抖延迟（毫秒）。
	- `moveItem(item, left, top, callback)`：移动单元的实现（默认直接设置 `left/top`）。
	- `scaleContainer(container, width, height, callback)`：调整容器尺寸的实现。

- 常用方法：
	- `initialize()`：初始化并应用布局（会监听 `resize`）。
	- `append(data, callback)`：使用 `createItem(data)` 创建并追加一个项目，然后布局。
	- `restack()`：重新计算列数并重新布局。
	- `reset()`：重置内部状态（清除 items 并重新布局）。

**框架适配器**
- Vue：`src/wrappers/vue/PrettyFallVue.js`，导出名为 `PrettyFallGrid` 的组件，接收 `items` 和 `options` 两个 props。
- React：`src/wrappers/react/PrettyFallReact.jsx`，导出 `PrettyFallReact` 函数组件，接收 `items` 与 `options`。
- Angular：`src/wrappers/angular/angular-PrettyFall.js`，包含一个 `ngPrettyFall` 指令示例。

这些封装负责在挂载时创建 `PrettyFall` 实例，并把 `items` 列表通过 `append` 注入。

**示例（Vue）**

```js
// 使用封装组件时只需在组件中传入 items 与 options
<PrettyFallGrid :items="list" :options="{ itemsSelector: '.grid-item' }"/>
```

**开发与演示**
- 源码位于 `src/`，默认入口 `src/PrettyFall.js`（导出核心类及 `ImageLoader`）。
- 运行 demo：

	```powershell
	npm install
	npm start
	# 打开 http://localhost:5000 （sirv 默认端口）查看 demo
	```

**贡献**
- 欢迎发起 PR 或 issue。请在提交前运行 `npm run build` 并在 `demo/` 中添加或更新示例。

**License**
- 本项目采用 MIT 许可证（见 `LICENSE`）。

---

