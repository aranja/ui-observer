import React, { useRef } from 'react'
import { scrollY, observe, useObserver, elementHeight } from '../src'

export const name = 'Scroll Counter'

export const Example = () => {
  const ref = useRef<HTMLDivElement>(null)

  const [scrollYValue, halfWay] = useObserver(
    observe(scrollY(), elementHeight(), (scrollY: number, height: number) => {
      return [scrollY, scrollY > height / 2]
    }),
    {
      defaultValue: [0, false],
      rootElementRef: ref,
    },
    []
  ) as [number, boolean]

  return (
    <div style={{ height: 3000 }} ref={ref}>
      <div style={{ position: 'fixed', top: 15, right: 15 }}>
        {`Scrolled ${scrollYValue}px ${halfWay ? 'half way' : ''}`}
      </div>
    </div>
  )
}
