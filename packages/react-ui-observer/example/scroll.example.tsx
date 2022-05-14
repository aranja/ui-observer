import React from 'react'
import { scrollY, observe, useObserver } from '../src'

export const name = 'Scroll Counter'

export const Example = () => {
  const scrollYValue = useObserver(
    observe(scrollY(), (scrollY: number) => scrollY > 300)
  )

  return (
    <div style={{ height: 3000 }}>
      <div style={{ position: 'fixed', top: 15, right: 15 }}>
        {`Scrolled ${scrollYValue}px`}
      </div>
    </div>
  )
}
