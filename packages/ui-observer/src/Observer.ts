import fastdom from 'fastdom'
import { getInstance, resolve, update } from './nodes'

export interface ObserverOptions {
  onChange?: (value: any) => void
  context?: object
  debug?: boolean
}

class Observer {
  public onChange?: (value: any) => void
  public root: any
  public queued: boolean
  public value: any
  public context: object
  public debug: boolean

  constructor(value: unknown, options: ObserverOptions = {}) {
    this.onChange = options.onChange
    this.root = null
    this.queued = false
    this.value = undefined
    this.context = options.context || {}
    this.debug = options.debug || false

    this.update(value)
  }

  public dispose() {
    this.onChange = undefined
    this.update(undefined)
  }

  public triggerChange = () => {
    if (this.onChange) {
      this.onChange(this.value)
    }
  }

  public printDebug() {
    if (this.debug) {
      const instance = getInstance(this.root)
      if (instance) {
        const table = instance.debug({})
        // tslint:disable-next-line:no-console
        console.table(table, ['value'])
      }
    }
  }

  public resolve = () => {
    this.queued = false
    const oldValue = this.value
    this.value = resolve(this.root)

    if (oldValue !== this.value) {
      this.printDebug()
      fastdom.mutate(this.triggerChange)
    }
  }

  public triggerResolve = () => {
    if (this.queued) {
      return
    }
    this.queued = true
    fastdom.measure(this.resolve)
  }

  public update(value: unknown) {
    const oldValue = this.value
    this.root = update(value, this.root, this)
    this.value = resolve(this.root)
    this.printDebug()

    if (this.onChange && this.value !== oldValue) {
      this.onChange(this.value)
    }
  }
}

export default Observer
