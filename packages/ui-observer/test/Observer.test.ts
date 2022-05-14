import Observer, { context, observe, subscribe } from '../src'

const mockSubscribe = () => {
  const unsubscribe = jest.fn()
  const sub = jest.fn().mockReturnValue(unsubscribe)
  const dep = subscribe(sub)
  return {
    dep,
    subscribe: sub,
    trigger: () => {
      if (unsubscribe.mock.calls.length === 0 && sub.mock.calls[0]) {
        sub.mock.calls[0][0]()
      }
    },
    unsubscribe,
  }
}

describe('Observer', () => {
  let observer: Observer | null

  afterEach(() => {
    if (observer) {
      observer.dispose()
      observer = null
    }
  })

  it('should invoke handler', () => {
    const handler = jest.fn()
    observer = new Observer(observe(handler))
    expect(handler).toHaveBeenCalled()
  })

  it('should return result', () => {
    observer = new Observer(observe(() => 5))
    expect(observer.value).toBe(5)
  })

  it('should pass deps', () => {
    observer = new Observer(observe(2, 3, (a: number, b: number) => a + b))
    expect(observer.value).toBe(5)
  })

  it('should resolve deps', () => {
    const dep = observe(() => 3)
    observer = new Observer(observe(2, dep, (a: number, b: number) => a + b))
    expect(observer.value).toBe(5)
  })

  it('should recursively resolve deps', () => {
    const dep1 = observe(2, 1, (a: number, b: number) => a + b)
    const dep2 = observe(dep1, 1, (a: number, b: number) => a + b)
    const dep3 = observe(dep2, 1, (a: number, b: number) => a + b)
    observer = new Observer(dep3)
    expect(observer.value).toBe(5)
  })

  it('should trigger onChange on first evaluation', () => {
    const onChange = jest.fn()
    observer = new Observer(
      observe(() => 5),
      { onChange }
    )
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('should trigger onChange when value changes during update', () => {
    const onChange = jest.fn()
    observer = new Observer(
      observe(() => 2),
      { onChange }
    )
    observer.update(observe(() => 5))
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it("should not trigger onChange when value doesn't change", () => {
    const onChange = jest.fn()
    observer = new Observer(
      observe(() => 2),
      { onChange }
    )
    observer.update(observe(() => 2))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should trigger onChange when deps change during update', () => {
    const onChange = jest.fn()
    observer = new Observer(
      observe(2, (a: number) => a),
      { onChange }
    )
    observer.update(observe(5, (a: number) => a))
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it("should not trigger onChange when deps don't change", () => {
    const onChange = jest.fn()
    observer = new Observer(
      observe(2, (a: number) => a),
      { onChange }
    )
    observer.update(observe(2, (a: number) => a))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should pass context to context variables', () => {
    const contextDep = context((c: { value: number }) => c.value)
    observer = new Observer(contextDep, { context: { value: 5 } })
    expect(observer.value).toBe(5)
  })

  it('should subscribe to changes', () => {
    let subscription = mockSubscribe()
    let onChange = jest.fn()
    observer = new Observer(subscription.dep, {
      onChange,
    })

    // Original values.
    expect(subscription.subscribe).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(observer.value).toBe(0)

    // Trigger onChange
    subscription.trigger()

    // Does nothing
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(observer.value).toBe(0)

    // Until requestAnimationFrame
    requestAnimationFrame.flush()
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(observer.value).toBe(1)

    subscription = mockSubscribe()
    onChange = jest.fn()
    observer = new Observer(subscription.dep, {
      onChange,
    })

    // Original values.
    expect(subscription.subscribe).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(observer.value).toBe(0)

    // Trigger onChange
    subscription.trigger()

    // Does nothing
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(observer.value).toBe(0)

    // Until requestAnimationFrame
    requestAnimationFrame.flush()
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(observer.value).toBe(1)
  })

  it('should unsubscribe on dispose', () => {
    const subscription = mockSubscribe()
    const onChange = jest.fn()
    const observer1 = new Observer(subscription.dep, {
      onChange,
    })
    const observer2 = new Observer(subscription.dep)

    // Should not trigger disposed observers.
    expect(onChange).toHaveBeenCalledTimes(1)
    observer1.dispose()
    subscription.trigger()
    expect(onChange).toHaveBeenCalledTimes(1)

    // Should unsubscribe when last observer is disposed.
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(0)
    observer2.dispose()
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
  })
})
