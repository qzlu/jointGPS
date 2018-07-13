<template>
  <div>
    <vehical-select-dialog v-on:child="get"></vehical-select-dialog>
    <div class="search">
      <div  class="form-inline">
        <label for="">_选择车辆_</label>
        <div class="input-group">
          <input type="text" disabled class="form-control" >
          <div class="input-group-addon">
            <i class="fa" data-toggle="modal" data-target="#modal">...</i>
          </div>
        </div>
        <label for="">_选择时间_</label>
        <div class="form-group">
          <el-date-picker
            v-model="value4"
            type="datetimerange"
            :picker-options="pickerOptions2"
            placeholder="_选择时间范围_"
            format="yyyy/MM/dd"
            align="right">
          </el-date-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-primary " >
            _查询_
          </button>
          <button type="reset" class="btn btn-primary "  >_取消_</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
     import VehicalSelectDialog from 'components/dialog/vehicalSelectDialog.vue'
//  import VehicalList from './vehicalList.vue'
  export default {
    name: 'search',
    data() {
      return {
        msgChild:'child',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value4: ''
      };
    },
    methods:{
      get:function (data) {
        $('.form-control').val(data);
        $('.form-control').attr('title',data)
        console.log(data)
      }
    },
    components:{
      VehicalSelectDialog
//      VehicalList
    },
    mounted(){
      console.log(this.props)
    },
  }
</script>
<style>
  .fa{
    cursor: pointer;
  }
</style>
