import { ref, computed } from 'vue'

// Vous pouvez adapter cette logique selon vos besoins
const featureFlags = ref({
  enableAdvancedFilter: true,
  filterFlag: 'advancedFilters' as 'advancedFilters' | 'filterMenu'
})

export function useFeatureFlags() {
  const enableAdvancedFilter = computed(() => featureFlags.value.enableAdvancedFilter)
  const filterFlag = computed(() => featureFlags.value.filterFlag)

  const setFeatureFlag = (flag: keyof typeof featureFlags.value, value: any) => {
    featureFlags.value[flag] = value
  }

  return {
    enableAdvancedFilter,
    filterFlag,
    setFeatureFlag
  }
}
