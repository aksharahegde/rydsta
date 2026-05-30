<script setup lang="ts">
import { CANONICAL_FIELDS } from '~/composables/useColumnMap'
import type { CanonicalField } from '#shared/types/import'

const FIELD_LABELS: Record<CanonicalField, string> = {
  startedAt: 'Start time',
  endedAt: 'End time',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
  fare: 'Fare',
  currency: 'Currency',
  distanceKm: 'Distance (km)',
  status: 'Status',
  vehicleType: 'Vehicle type',
}

const emit = defineEmits<{
  submit: []
}>()

const { pendingMapping } = useRideImport()
const { applyMapping } = useColumnMap()

const selections = ref<Partial<Record<CanonicalField, string>>>({})

watch(
  pendingMapping,
  (pending) => {
    if (!pending) {
      selections.value = {}
      return
    }
    const next: Partial<Record<CanonicalField, string>> = {}
    for (const mapping of pending.mappings) {
      const header = pending.table.headers[mapping.columnIndex]
      if (header) next[mapping.field] = header
    }
    selections.value = next
  },
  { immediate: true },
)

const headers = computed(() => pendingMapping.value?.table.headers ?? [])

function selectionFor(field: CanonicalField): string {
  return selections.value[field] ?? ''
}

function updateSelection(field: CanonicalField, header: string) {
  if (!header) {
    const { [field]: _, ...rest } = selections.value
    selections.value = rest
    return
  }
  selections.value = { ...selections.value, [field]: header }
}

function onSubmit() {
  applyMapping(selections.value)
  emit('submit')
}
</script>

<template>
  <section
    v-if="pendingMapping"
    class="mapping-confirm"
    data-testid="ride-mapping-confirm"
  >
    <header class="mapping-confirm__header">
      <h2>Match your columns</h2>
      <p class="mapping-confirm__lede">
        We could not confidently map every field. Choose which CSV column matches each trip attribute.
      </p>
      <p class="mapping-confirm__file">
        {{ pendingMapping.path }}
      </p>
    </header>

    <form
      class="mapping-confirm__form"
      @submit.prevent="onSubmit"
    >
      <div
        v-for="field in CANONICAL_FIELDS"
        :key="field"
        class="mapping-confirm__row"
      >
        <label
          class="mapping-confirm__label"
          :for="`mapping-${field}`"
        >{{ FIELD_LABELS[field] }}</label>
        <select
          :id="`mapping-${field}`"
          class="mapping-confirm__select"
          :value="selectionFor(field)"
          @change="updateSelection(field, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">
            — Not mapped —
          </option>
          <option
            v-for="header in headers"
            :key="header"
            :value="header"
          >
            {{ header }}
          </option>
        </select>
      </div>

      <button
        type="submit"
        class="mapping-confirm__submit"
        data-testid="ride-mapping-submit"
      >
        Continue
      </button>
    </form>
  </section>
</template>

<style scoped>
.mapping-confirm {
  max-width: 36rem;
}

.mapping-confirm__header {
  margin-bottom: 1.5rem;
}

.mapping-confirm h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.mapping-confirm__lede {
  margin: 0 0 0.75rem;
  color: #475569;
  line-height: 1.5;
}

.mapping-confirm__file {
  margin: 0;
  font-size: 0.8125rem;
  color: #64748b;
  word-break: break-all;
}

.mapping-confirm__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mapping-confirm__row {
  display: grid;
  gap: 0.375rem;
}

@media (min-width: 480px) {
  .mapping-confirm__row {
    grid-template-columns: 9rem 1fr;
    align-items: center;
    gap: 1rem;
  }
}

.mapping-confirm__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.mapping-confirm__select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
  color: #0f172a;
}

.mapping-confirm__select:focus {
  outline: 2px solid #6366f1;
  outline-offset: 1px;
}

.mapping-confirm__submit {
  margin-top: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: #6366f1;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
}

.mapping-confirm__submit:hover {
  background: #4f46e5;
}
</style>
