<template>
  <a-modal
    title="运行记录"
    style="top: 10px;left: 130px"
    :width="1300"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="开始时间">
                <a-date-picker showTime format="YYYY-MM-DD" @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="截止时间">
                <a-date-picker showTime format="YYYY-MM-DD" @change="onChange1" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchData()">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
                <a-button style="margin-left: 8px" :href = "url+'?startDate='+this.queryParam.startDate+ '&endDate=' + this.queryParam.endDate+ '&robotCode=' + this.queryParam.robotCode + '&robotId=' + this.queryParam.robotId">数据导出</a-button>
              </span>
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
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="editRemark(record)">备注</a>
          </template>
        </span>
        <template slot-scope="text" slot="remark">
          <ellipsis :length="10" tooltip>{{text}}</ellipsis>
        </template>
      </s-table>
      <edit-robot-note ref="editRobotNote" @ok="handleOk" />
    </a-card>
  </a-modal>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { queryData } from '@/api/common'
import editRobotNote from './EditRobotNote'
import { uploadUrl } from '@/api/upload'

export default {
  components: {
    STable,
    Ellipsis,
    editRobotNote
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
          dataIndex: 'id',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '记录日期',
          dataIndex: 'noteDate'
        },
        {
          title: '开机时间',
          dataIndex: 'openTime'
        },
        {
          title: '开机次数',
          dataIndex: 'openCount'
        },
        {
          title: '在线时长',
          dataIndex: 'onlineDuration'
        },
        {
          title: '行走里程',
          dataIndex: 'mileage'
        },
        {
          title: '最后一次心跳时间',
          dataIndex: 'lastOnlineTime'
        },
        {
          title: '业务匹配次数',
          dataIndex: 'buisCount'
        },
        {
          title: '闲聊匹配次数',
          dataIndex: 'chatCount'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: uploadUrl + 'RobotNote/exportNote',
      // 查询参数
      queryParam: {
        startDate: '',
        endDate: '',
        robotCode: '',
        robotId: ''
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      loadData: parameter => {
        var parma = Object.assign(parameter, this.queryParam)
        return queryData(parma, '/RobotNote/queryRobotNote').then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    show (record) {
      this.queryParam.robotCode = record.code
      this.queryParam.robotId = record.id
      this.queryParam.startDate = ''
      this.queryParam.endDate = ''
      this.visible = true
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    // 查看运行记录
    editRemark(record) {
      this.$refs.editRobotNote.edit(record)
    },
    onChange(date, dateString) {
      this.queryParam.startDate = dateString
      // this.$refs.table.refresh()
    },
    onChange1(date, dateString) {
      this.queryParam.endDate = dateString
      // this.$refs.table.refresh()
    },
    // 重置
    resetQuery() {
      this.$refs.table.refresh(true)
    },
    searchData() {
      this.$refs.table.refresh()
    },

    handleSubmit() {
      this.visible = false
    }
  }
}
</script>