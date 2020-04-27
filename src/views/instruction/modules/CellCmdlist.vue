<template>
    <a-modal
      title="选择命令"
      style="top: 20px;"
      :width="1000"
      v-model="visible"
      :afterClose="afterClose"
      @ok="handleSubmit"
      v-preventReClick
      :destroyOnClose="true"
      :maskClosable = "false"
    >
         <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="单位指令类型">
              <a-select
                v-model="queryParam.typeId"
                showSearch
                placeholder="选择单位指令类型"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option v-for="(item ,key) in cmdTypeList" :key="key" :value="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 8px"  @click="resetQuery()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :rowSelection="rowSelection"
      >
      <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
      </span>
      </s-table>

    </a-modal>
</template>
<script>
import { STable } from '@/components'
import { queryData } from '@/api/common'
export default {
  name: 'CellCmdlist',
  components: {
    STable
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        typeId: ''
      },
      selectItem:[],
      cmdTypeList: [],
      selectedRowKeys:[],
      visible: false,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },

        {
          title: '编号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '命令名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '命令名称参数类型',
          dataIndex: 'typeName',
          scopedSlots: { customRender: 'typeName' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(Object.assign(parameter, this.queryParam), '/cmdUnit/list').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        hideDefaultSelections: true,
        selectedRowKeys:this.selectedRowKeys,
        selections:true,
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            this.selectItem = selectedRows[0];
            this.selectedRowKeys = selectedRowKeys
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  created() {
    this.getCmdType()
  },
  methods: {
    show(record) {
      this.visible = true;
      if(record != 0){
        this.selectedRowKeys.push(record)
      }
    },
    handleSubmit() {
        if(this.selectItem.length <= 0 ){
            this.$message.error('请选择一项');
            return false;
        }
        this.visible = false;
        this.$emit('ok', this.selectItem);

    },
    // 获取单元指令类型
    getCmdType() {
      queryData({}, '/cmdUnitType/getCmdUnitTypeList').then(res => {
        console.log(res)
        if (res.code == 0) {
          this.cmdTypeList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 下拉框
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 处理刷新
    handleRefresh() {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleEditVisible(record) {
      this.$refs.editModal.add(record)
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },
    afterClose(){
       this.selectedRowKeys = [];
        this.selectItem = []
    }
  }
}
</script>

