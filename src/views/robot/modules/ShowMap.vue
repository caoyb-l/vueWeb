<template>
    <a-modal
     title="地图记录点"
      style="top: 20px;"
      :width="1000"
      v-model="visible"
      @ok="handleSubmit">

    <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
        <a-col :md="8" :sm="24">
            <a-form-item label="记录点名称">
                <a-input v-model="queryParam.name"/>
            </a-form-item>
        </a-col>
          <a-col :md="8" :sm="24">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
        ref="table"
        size="middle"
        rowKey="no"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="deleteMapPoint(record)" v-action:delete>删除</a>
          </template>
        </span>
      </s-table>

  </a-card>
</a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
import { STable } from '@/components'
export default {
  components: {
    STable
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '记录点名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '角度',
          dataIndex: 'angle'
        },
        {
          title: 'X坐标',
          dataIndex: 'gridX'
        },
        {
          title: 'Y坐标',
          dataIndex: 'gridY'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询参数
      queryParam: {
        name: ''
      },
      mapId: 0,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      loadData: parameter => {
        var parma = Object.assign(parameter, { mapId: this.mapId }, this.queryParam)
        return queryData(parma, '/mapGsPoint/getMapGsPointPage').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    add(record) {
      this.mapId = record.id
      this.visible = true;
      this.$refs.table.refresh(true)
    },
     // 表单重置
    resetQuery(){
      this.queryParam = {},
      this.$refs.table.refresh(true)
    },
    searchData() {
      this.$refs.table.refresh()
    },
    handleSubmit() {
      this.visible = false;
    },
    deleteMapPoint(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.name} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            var id = { entityId: record.id }
            queryData(id, '/mapGsPoint/delete').then(res => {
              if (res.code == 0) {
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
