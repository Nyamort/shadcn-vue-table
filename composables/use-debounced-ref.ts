import { ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(source: Ref<T>, delay: number): Ref<T> {
  const debouncedRef = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    source,
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        debouncedRef.value = newValue
        timeoutId = null
      }, delay)
    },
    { deep: true }
  )

  return debouncedRef
}
