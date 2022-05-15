<p align="center">
  <img src="https://user-images.githubusercontent.com/8494120/168484515-cccc6a24-6647-4a84-9311-bba2dc7afce3.png" width="240" />
</p>


<h1 align="center">ui-observer</h1>
<h3 align="center">A DOM measurement library with a powerful API <br />that makes it easy to create complex UI interactions.</h3>

<br>

This repo contains two packages: core (`ui-observer`) and a react implementation (`react-ui-observer`).

Why ui-observer?

* **Speed**: Batched DOM updates and no layout trashing.
* **Power**: Measure what you need and then react to changes.

## Getting Started

```shell
yarn add react-ui-observer
# or yarn add ui-observer
```

and then use it to create magic

```jsx
const [scrollYValue, hasScrolledEnough] = useObserver(
  observe(scrollY(), (scrollY: number) => [scrollY, scrollY > 300])
)

return (
  <div style={{ height: 3000 }}>
    <div style={{ position: 'fixed', top: 15, right: 15, color: hasScrolledEnough ? 'cyan' : 'inherit' }}>
      {`Scrolled ${scrollYValue}px`}
    </div>
  </div>
)
```
