<template>
  <a-card class="card">
    <a-row type="flex" justify="center" align="top">
      <a-col :span="20">
        <SearchAPI @change="changeHandler" />
      </a-col>
      <a-col :span="2">
        <a-button v-show="isShowSetting" type="primary" @click="handlerClickSetting"
          >配置属性</a-button
        >
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

  <a-modal
    :visible="settingVisible"
    width="1000px"
    title="配置属性"
    @ok="handleOk"
    @cancel="handlerCancel"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script setup lang="ts">
  import { defineComponent, ref, reactive, onMounted, computed, nextTick } from 'vue'
  import SearchAPI from './components/SearchAPI.vue'
  import Table from './components/table.vue'

  const isShowSetting = ref(false)
  const tabPosition = ref('left')
  const tabRef = ref([])
  const activeKey = ref('')
  const settingVisible = ref(false)

  const tableColumns = [
    { title: '数据类型', dataIndex: 'dataType', width: 100, align: 'left' },
    { title: '字段', dataIndex: 'identifier', minWidth: 150, align: 'left' },
    { title: '名称描述', dataIndex: 'name', minWidth: 150, align: 'left' },
    { title: '备注', dataIndex: 'remark', minWidth: 150, align: 'left' },
  ]

  const changeHandler = (val: any) => {
    console.log(val)
    const cur = val[0]
    activeKey.value = cur.id
    tabRef.value = val.map((item: any) => {
      return { value: item.id, name: item.name, source: item }
    })
    nextTick(() => {
      isShowSetting.value = true
    })
  }

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

  const handlerClickSetting = () => {
    settingVisible.value = true
  }
  const handleOk = () => {
    settingVisible.value = false
  }
  const handlerCancel = () => {
    settingVisible.value = false
  }
</script>

<style lang="less" scoped>
  .ant-row {
    margin-top: 10px;
  }
</style>
