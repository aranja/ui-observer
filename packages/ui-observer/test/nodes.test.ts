// tslint:disable:no-empty

import { observe } from '../src'
import { update } from '../src/nodes'

describe('nodes', () => {
  it('creates singleton based on func and props', () => {
    const a = () => {}
    const b = () => {}
    const instanceA = update(observe(a))
    expect(update(observe(a))).toBe(instanceA)
    expect(update(observe(5, a))).not.toBe(instanceA)
    expect(update(observe(6, a))).not.toBe(instanceA)
    expect(update(observe(b))).not.toBe(instanceA)
  })

  it('reuses singleton on updates', () => {
    const a = () => {}
    const b = () => {}
    const instanceA = update(observe(a))
    expect(update(observe(a), instanceA)).toBe(instanceA)
    expect(update(observe(b), instanceA)).not.toBe(instanceA)
  })

  it('disposes unused singletons', () => {
    const a = () => {}
    const b = () => {}
    let instance

    const instanceA = (instance = update(observe(a)))
    instance = update(observe(b), instance)
    instance = update(observe(a), instance)

    expect(instance).not.toBe(instanceA)
  })

  it('reference counts correctly', () => {
    const a = () => {}

    // New ref.
    const instanceA = update(observe(a))
    expect(instanceA.refs).toBe(1)

    // Same ref.
    update(observe(a), instanceA)
    expect(instanceA.refs).toBe(1)

    // Deep ref.
    let instanceTree = update(observe(observe(a), observe(a), () => {}))
    expect(instanceA.refs).toBe(3)
    instanceTree = update(
      observe(observe(a), observe(a), () => {}),
      instanceTree
    )
    expect(instanceA.refs).toBe(3)

    // Tree of refs.
    instanceTree = update(
      observe(
        observe(observe(a), observe(a), () => {}),
        observe(a),
        () => {}
      )
    )
    expect(instanceA.refs).toBe(6)

    instanceTree = update(
      observe(
        observe(observe(a), observe(a), () => {}),
        observe(a),
        () => {}
      ),
      instanceTree
    )
    expect(instanceA.refs).toBe(6)

    update(null, instanceTree)
    expect(instanceA.refs).toBe(3)
  })
})
