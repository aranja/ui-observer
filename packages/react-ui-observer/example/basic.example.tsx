import React from 'react'
import Observer, { observe } from '../src'

export const name = 'Basic'

const isVisible = observe(() => true)

export const Example = () => (
  <Observer value={isVisible}>
    {isVisible => (isVisible ? 'Hello world' : null)}
  </Observer>
)
