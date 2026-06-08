<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import { TreeRoot, TreeItem, useForwardPropsEmits, type TreeRootEmits, type TreeRootProps } from 'reka-ui'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<Omit<TreeRootProps, 'getKey'> & {
  class?: string
  items?: T[]
  /** Object key to map to the item's label */
  labelKey?: string
  /** Object key to map to the item's children array */
  childrenKey?: string
  /** Object key to map to the item's icon component */
  iconKey?: string
  /** Custom function to derive a unique key from an item */
  getKey?: (item: T) => string
}>(), {
  items: () => [],
  labelKey: 'label',
  childrenKey: 'children',
  iconKey: 'icon',
  selectionBehavior: 'toggle',
})

const emits = defineEmits<TreeRootEmits>()

const delegatedProps = computed(() => {
  // Destructure custom props out so we don't accidentally forward them to the DOM
  const { class: _, items, labelKey, childrenKey, iconKey, getKey, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Helper to resolve the key for an item, matching TreeRoot's exact requirements
const getKeyResolver = (item: T) => {
  if (props.getKey) return props.getKey(item)
  return item[props.labelKey] as string
}
</script>

<template>
  <TreeRoot
      v-bind="forwarded"
      :class="cn('w-full select-none list-none', props.class)"
      :items="items"
      :get-key="getKeyResolver"
      :get-children="(item) => item[childrenKey]"
      v-slot="{ flattenItems }"
  >
    <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
        v-slot="{ isExpanded, isSelected, isIndeterminate }"
        :class="cn(
        'group relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
        'data-[selected]:bg-accent data-[selected]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
      )"
        :style="{ paddingLeft: `${item.level * 1.5}rem` }"
        @select="(event) => {
        // Prevent selection for items with children (folders).
        // Reka UI will still natively expand/collapse the folder on click.
        if (item.hasChildren) {
            event.preventDefault()
        }
      }"
    >
      <component
          :is="isExpanded ? ChevronDown : ChevronRight"
          v-if="item.hasChildren"
          class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:text-accent-foreground/80"
      />
      <span v-else class="h-4 w-4 shrink-0" />

      <slot
          name="item"
          :item="item.value"
          :expanded="isExpanded"
          :selected="isSelected"
          :indeterminate="isIndeterminate"
      >
        <component
            :is="item.value[iconKey]"
            v-if="item.value[iconKey]"
            class="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground"
            :class="{ 'text-accent-foreground': isSelected }"
        />

        <span class="truncate">
          {{ item.value[labelKey] }}
        </span>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>