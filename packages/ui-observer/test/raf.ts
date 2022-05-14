const timeouts = new Map<FrameRequestCallback, ReturnType<typeof setTimeout>>()

const mockRaf = (callback: FrameRequestCallback) => {
  timeouts.set(
    callback,
    setTimeout(() => {
      timeouts.delete(callback)
      callback(0)
    })
  )
  return 0
}

mockRaf.flush = () => {
  for (const [callback, timeout] of Array.from(timeouts.entries())) {
    callback(0)
    clearTimeout(timeout)
  }
  timeouts.clear()
}

window.requestAnimationFrame = mockRaf
