<template>
  <a-form :layout="formState.layout" :model="formState">
    <a-form-item label="Project name">
      <a-select
        ref="select"
        v-model:value="modelRef.project"
        :style="itemStyle"
        @change="projectHandleChange"
      >
        <a-select-option v-for="d in projects" :key="d.value">
          {{ d.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="项目模块">
      <a-select
        ref="select2"
        v-model:value="modelRef.module"
        :style="itemStyle"
        @change="moduleHandleChange"
      >
        <a-select-option v-for="d in modules" :key="d.value">
          {{ d.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="对应界面">
      <a-select
        ref="select3"
        v-model:value="modelRef.page"
        :style="itemStyle"
        @change="pageHandleChange"
      >
        <a-select-option v-for="d in pages" :key="d.value">
          {{ d.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="接口信息">
      <p>{{ requestUrl }}</p>
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
  import { ref, reactive, computed, nextTick, onMounted, defineEmit } from 'vue'
  import { getQueryRAPModel } from '../api'

  const emit = defineEmit<(e: 'change', val: any) => void>()

  interface FormState {
    layout: 'horizontal' | 'vertical' | 'inline'
  }
  interface ObjectKey {
    [key: string]: any
  }
  const formState = reactive({
    layout: 'inline',
  })
  const modelRef = reactive({
    project: '15',
    module: '',
    page: '',
  })
  const itemStyle = computed(() => {
    return {
      width: '250px',
    }
  })

  const projects = ref([
    { value: '15', name: 'TJ-天津数据监督管理平台' },
    { value: '12', name: 'APP监测 ' },
  ])
  const modules = ref([])
  const pages = ref([])

  const requestUrl = ref('')

  // moduleId => 映射pageList集合
  const moduleObjectRef: ObjectKey = {}
  // pageListId => 映射actionList集合
  const pageListMapper: ObjectKey = {}

  const projectHandleChange = (val: any) => {
    // console.log(`selected ${value}`)
    initQueryRAPModel(val)
  }
  const moduleHandleChange = (val: any) => {
    // console.log(`selected ${val}`)
    const pageList = moduleObjectRef[val].map((item: any) => {
      return { value: item.id, name: item.name }
    })
    pages.value = pageList
  }

  const pageHandleChange = (val: any) => {
    // console.log(pageListMapper[val][0])
    const cur = pageListMapper[val][0]
    requestUrl.value = cur.requestUrl
    emit('change', pageListMapper[val])
  }

  // 获取rap接口model
  const initQueryRAPModel = (projectId: any) => {
    getQueryRAPModel(projectId).then((resp) => {
      const { data } = resp
      const modelJson = eval('(' + data.modelJSON + ')')
      console.log(modelJson)
      modules.value = modelJson.moduleList.map((m: any) => {
        moduleObjectRef[m.id] = m.pageList
        m.pageList.forEach((item: any) => {
          pageListMapper[item.id] = item.actionList
        })
        return { value: m.id, name: m.name }
      })
    })
  }

  onMounted(() => {
    const projectId = 15
    initQueryRAPModel(projectId)
  })
</script>

<style scoped></style>
