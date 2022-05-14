import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  MutableRefObject,
} from 'react'
import BaseObserver from 'ui-observer'

interface ObserverOptions {
  defaultValue?: unknown
  debug?: boolean
  context?: Record<string, unknown>
  onChange?: (state: unknown) => void
  rootElementRef?: MutableRefObject<HTMLElement>
}

export const useObserver = (
  value: unknown,
  {
    context,
    defaultValue,
    debug,
    rootElementRef,
    onChange,
  }: ObserverOptions = {}
): unknown => {
  const rootElement = rootElementRef?.current
  const [state, setState] = useState<unknown | null>(defaultValue)
  const observer = useRef<BaseObserver | null>(null)
  const onChangeRef = useRef<undefined | ((state: unknown) => void)>(onChange)
  onChangeRef.current = onChange

  // Handle value updates by calling onChange and triggering re-render.
  const onValueChange = useCallback(
    (state: unknown) => {
      if (onChangeRef.current) {
        onChangeRef.current(state)
      }

      setState(state)
    },
    [setState, onChangeRef]
  )

  useEffect(() => {
    // Create a singleton BaseObserver.
    observer.current = new BaseObserver(value, {
      onChange: onValueChange,
      debug,
      context: {
        rootElement,
        ...context,
      },
    })

    return () => {
      if (observer.current) {
        observer.current.dispose()
        observer.current = null
      }
    }
  }, [observer])

  // React to value, context and ref changes.
  useMemo(() => {
    if (observer.current) {
      // Update Observer with new context and value.
      observer.current.context = {
        rootElement,
        ...context,
      }
      observer.current.update(value)
    }
  }, [observer, value, context, rootElement])

  return state
}
