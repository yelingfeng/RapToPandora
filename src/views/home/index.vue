<template>
  <a-card class="card">
    <a-row type="flex" justify="center" align="top">
      <a-col :span="20">
        <a-form
          :layout="formState.layout"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="Project name">
            <a-select
              v-model:value="modelRef.project"
              :style="itemStyle"
              ref="select"
              @change="projectHandleChange"
            >
              <a-select-option v-for="d in projects" :key="d.value">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="项目模块">
            <a-select
              v-model:value="modelRef.module"
              :style="itemStyle"
              ref="select2"
              @change="moduleHandleChange"
            >
              <a-select-option v-for="d in modules" :key="d.value">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="对应界面">
            <a-select
              v-model:value="modelRef.page"
              :style="itemStyle"
              ref="select3"
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
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="top">
      <a-col :span="20">
        <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition">
          <a-tab-pane v-for="pane in tabRef" :key="pane.value" :tab="pane.name">
            <a-divider orientation="left">请求参数列表</a-divider>
            <Table size="small" :options="getTableOpt(pane.source)" />
            <a-divider orientation="left">返回参数列表(忽略status,message,total)</a-divider>
            <Table size="small" :options="getTableOpt2(pane.source)" />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, UnwrapRef, onMounted, computed } from 'vue'
  import { getQueryRAPModel } from './api'
  import Table from './components/table.vue'
  interface FormState {
    layout: 'horizontal' | 'vertical' | 'inline'
  }
  interface ObjectKey {
    [key: string]: any
  }
  export default defineComponent({
    components: {
      Table,
    },
    setup() {
      const formState: UnwrapRef<FormState> = reactive({
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
      const tabRef = ref([])

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
        activeKey.value = cur.id
        tabRef.value = pageListMapper[val].map((item: any) => {
          return { value: item.id, name: item.name, source: item }
        })
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

      const tabPosition = ref('left')
      const activeKey = ref('')

      const tableColumns = [
        { title: '数据类型', dataIndex: 'dataType', width: 100, align: 'left' },
        { title: '字段', dataIndex: 'identifier', minWidth: 150, align: 'left' },
        { title: '名称描述', dataIndex: 'name', minWidth: 150, align: 'left' },
        { title: '备注', dataIndex: 'remark', minWidth: 150, align: 'left' },
      ]

      const getTableOpt = (val: any) => {
        const requestParameterList = val.requestParameterList
        const tableOpt = {
          columns: tableColumns,
          data: requestParameterList.map((item: any) => {
            return {
              key: item.id,
              dataType: item.dataType,
              name: item.name,
              identifier: item.identifier,
              remark: item.remark,
            }
          }),
        }
        return tableOpt
      }

      const getTableOpt2 = (val: any) => {
        const responseParamterList = val.responseParameterList.find((item: any) => {
          return item.identifier.indexOf('data') > -1
        }).parameterList
        const tableOpt = {
          columns: tableColumns,
          data: responseParamterList.map((item: any) => {
            return {
              key: item.id,
              dataType: item.dataType,
              name: item.name,
              identifier: item.identifier,
              remark: item.remark,
            }
          }),
        }
        return tableOpt
      }

      return {
        modelRef,
        tabRef,
        itemStyle,
        labelCol: { span: 10 },
        wrapperCol: { span: 10 },
        projects,
        modules,
        pages,
        requestUrl,
        formState,
        projectHandleChange,
        moduleHandleChange,
        pageHandleChange,

        tabPosition,
        activeKey,

        getTableOpt,
        getTableOpt2,
      }
    },
  })
</script>

<style lang="less" scoped>
  .ant-row {
    margin-top: 10px;
  }
</style>
