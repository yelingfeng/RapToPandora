<template>
  <a-table :data-source="options.data" :columns="options.columns" />
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  interface ITabTables {
    data: object[]
    columns: object[]
  }
  export default defineComponent({
    props: {
      options: {
        type: Object as PropType<ITabTables>,
        default() {
          return {}
        },
      },
    },
    setup() {},
  })
</script>

<style scoped></style>
