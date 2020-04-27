<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.aiuiName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="描述">
              <a-input v-model="queryParam.aiuiDescn" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="handleOk">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
            <a-button style="margin-left: 8px" type="primary" @click="handleAdd()" v-action:add>新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="middle"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleUpdate(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" v-action:edit />
          <a-switch
            :defaultChecked="record.isAble==1?true:false"
            @click="handleIsAble ($event,record)"
          >
            <a-icon type="check" slot="checkedChildren" />
            <a-icon type="close" slot="unCheckedChildren" />
          </a-switch>
          <a-divider type="vertical" v-action:delete />
          <a @click="deleteSkillsType(record)">彻底删除</a>
        </template>
      </span>
    </s-table>
    <edit-aiuiScene ref="editAiui" @ok="handleOk" />
    <create-aiuiScene ref="createAiui" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import CreateAiuiScene from './modules/CreateAiuiScene'
import EditAiuiScene from './modules/EditAiuiScene'
import { queryData } from '@/api/common'

export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    CreateAiuiScene,
    EditAiuiScene
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        aiuiName: '',
        aiuiDescn: ''
      },
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'scene',
          scopedSlots: { customRender: 'scene' }
        },
        {
          title: '描述',
          dataIndex: 'descn',
          scopedSlots: { customRender: 'descn' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(Object.assign(parameter, this.queryParam), '/aiuiScene/list').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 表单重置
    resetQuery() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleOk() {
      console.log('呵呵')
      this.$refs.table.refresh(true)
    },
    handleUpdate(record) {
      this.$refs.editAiui.add(record)
    },
    handleAdd() {
      this.$refs.createAiui.add()
    },
    //禁用
    handleIsAble(checked, record) {
      console.log(checked)
      var param = { entityId: record.id }
      if (checked) {
        param.isAble = 1
      } else {
        param.isAble = 0
      }
      queryData(param, '/aiuiScene/isAble')
        .then(res => {
          _this.orgNames = res.result
          if (res.code !== 0) {
            _this.$message.error(res.message)
          }
        })
        .catch(err => console.log(err))
    },
    //删除
    deleteSkillsType (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.scene} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            var id = { entityId: record.id }
            queryData(id, '/aiuiScene/delete').then(res => {
              if (res.code === 0) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>
