<template>
  <div class='realtime-containner'>
    <div class="data-board">
      <el-row>
        <el-col :span="8">
          <div class="title">
            总报警数量
          </div>
          <div class="data">
            22
          </div>
        </el-col>
        <el-col :span="8">
          <div class="title">
            未确定报警数量
          </div>
          <div class="data">
            22
          </div>
        </el-col>
        <el-col :span="8">
          <div class="title">
            待修复报警数量
          </div>
          <div class="data">
            22
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="data-list">
      <el-tabs type="card">
        <el-tab-pane label="实时数据">
          <div class="operation">
            <el-button type="text" size="medium" icon="el-icon-search">导出</el-button>
            <div class="search">
              <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            </div>
            <el-button type="text" size="medium" icon="el-icon-search">筛选</el-button>
          </div>
          <el-table ref="filterTable" :data="tableData" style="width: 100%">
            <el-table-column prop="id" type="selection"></el-table-column>
            <el-table-column prop="id" label="序号" sortable width="80" align="center"></el-table-column>
            <el-table-column label="报警源">
              <template slot-scope="scope">
                <div class="map">
                  <MapContainner :Longitude="scope.row.longitude" :Latitude="scope.row.latitude" :root="scope.row.root"
                    style="height: 80px;"></MapContainner>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="occTime" label="报警发生时间" sortable width="250" align="center"></el-table-column>
            <!-- <el-table-column prop="root" label="报警源" sortable></el-table-column> -->

            <el-table-column prop="level" label="报警级别" sortable width="120" align="cnter">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 1" type="danger">一级</el-tag>
                <el-tag v-else-if="scope.row.level == 2" type="warning">二级</el-tag>
                <el-tag v-else type="info">三级</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="acknowledgingTime" label="确认时间" sortable></el-table-column> -->
            <!-- <el-table-column prop="recoveryTime" label="恢复时间" sortable></el-table-column> -->
            <el-table-column prop="recoveryState" label="恢复状态" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.recoveryState == 0" style="color: #F56C6C;">未恢复</span>
                <span v-else style="color: #67C23A;">已恢复</span>
              </template>
            </el-table-column>
            <el-table-column prop="confirmState" label="确认状态" width="120" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.confirmState == 0" type="primary" size="mini"
                  @click="handleConfirm(scope.row)">确认</el-button>
                <el-button v-else type="normal" size="mini" disabled>已确认</el-button>

              </template>

            </el-table-column>
            <el-table-column label="查看详情" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="recoveryId" label="报警恢复者" sortable></el-table-column> -->
            <!-- <el-table-column prop="confirmId" label="报警确认者" sortable></el-table-column> -->
          </el-table>
        </el-tab-pane>

      </el-tabs>

    </div>
    <div class="data-dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
        <div class="map">
          <MapContainner :Longitude="dialogData.longitude" :Latitude="dialogData.latitude" :root="dialogData.root"
            style="height: 280px;"></MapContainner>

        </div>
        <div class="info">
          <el-descriptions class="margin-top" :column="3" :size="size" border>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-coordinate"></i>
                ID
              </template>
              {{ dialogData.id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-date"></i>
                报警发生时间
              </template>
              {{ dialogData.occTime }}
              <!-- {{ getTimer(dialogData.occTime) }} -->
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>
                报警类型
              </template>
              {{ dialogData.type }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-discount"></i>
                报警级别
              </template>
              <el-tag size="small" v-if="dialogData.level == 1" type="danger">一级</el-tag>
              <el-tag size="small" v-else-if="dialogData.level == 2" type="warning">二级</el-tag>
              <el-tag size="small" v-else-if="dialogData.level == 3" type="info">三级</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-place"></i>
                报警源
              </template>
              {{ dialogData.root }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ dialogBtn1 }}</el-button>
          <el-button type="primary" @click="dialogVisible = false" v-show="dialogBtn2show">{{ dialogBtn2 }}</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import MapContainner from '@/components/MapContainner'
import { getTimer } from '@/utils/dataformat.js';
export default {

  components: {
    MapContainner
  },
  data() {
    //这里存放数据
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogBtn1: '',
      dialogBtn2: '',
      dialogBtn2show: false,
      dialogData: {
        "id": null, //数据库字段
        "occTime": null, //报警发生时间
        "root": null, //报警源
        "code": null,//废弃字段不用管
        "type": null, //报警类型
        "acknowledgingTime": null,//确认时间
        "recoveryTime": null,//恢复时间
        "confirmState": 0,//确认状态（0：未确认，1：确认）
        "recoveryState": 0,//恢复状态
        "level": 0, //报警级别
        "longitude": 0,//经度119.908193,28.450324
        "latitude": 0,//维度
        "recoveryId": null,//报警恢复者
        "confirmId": null,//报警确认者
      },
      tableData: [
        {
          "id": "1", //数据库字段
          "occTime": "2024-08-20 14:01:45", //报警发生时间
          "root": "Building A", //报警源
          "code": "CODE123",//废弃字段不用管
          "type": "Fire", //报警类型
          "acknowledgingTime": null,//确认时间
          "recoveryTime": null,//恢复时间
          "confirmState": 0,//确认状态（0：未确认，1：确认）
          "recoveryState": 0,//恢复状态
          "level": 2, //报警级别
          "longitude": 119.908193,//经度119.908193,28.450324
          "latitude": 28.450324,//维度
          "recoveryId": null,//报警恢复者
          "confirmId": null,//报警确认者
        },
        {
          "id": "12",
          "occTime": "2024-08-20 14:30:00",
          "root": "lsu_AAA101",
          "code": "A001",
          "type": "Fire Alarm",
          "acknowledgingTime": "2024-08-29 19:14:13",
          "recoveryTime": "2024-08-20 15:00:00",
          "confirmState": 1,
          "recoveryState": 0,
          "level": 2,
          "longitude": 119.903075,
          "latitude": 28.459265,
          "recoveryId": null,
          "confirmId": "3300551401"
        },
        {
          "id": "5",
          "occTime": "2024-08-23 14:30:00",
          "root": "lsu_AAA101",
          "code": "null",
          "type": "Fire Alarm",
          "acknowledgingTime": null,
          "recoveryTime": null,
          "confirmState": 0,
          "recoveryState": 0,
          "level": 2,
          "longitude": 119.919592,
          "latitude": 28.444709,
          "recoveryId": null,
          "confirmId": null
        }
      ]
    };
  },
  methods: {
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleConfirm(row) {
      this.dialogTitle = '报警确认'
      this.dialogBtn1 = '取消'
      this.dialogBtn2 = '确认'
      this.dialogData = row
      this.dialogBtn2show = true
      this.dialogVisible = true
    },
    handleDetail(row) {
      this.dialogTitle = '报警详情'
      this.dialogBtn1 = '关闭'
      this.dialogData = row
      this.dialogBtn2show = false
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    }
  },

}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.realtime-containner {
  margin: 30px;
}

.map {
  border-radius: 6px;
  overflow: hidden;
}

.data-board {
  border: #e4e7ed 1px solid;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;

  .title {
    font-size: 16px;
    padding: 5px;
    color: #606266;
  }

  .data {
    font-size: 24px;
    color: #303133;
  }
}

.data-dialog {
  .info {
    margin-top: 20px;
  }
}
.operation{
  display: flex;
  justify-content: space-around;
}
</style>
