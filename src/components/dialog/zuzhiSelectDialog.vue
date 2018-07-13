<template>
  <div class="container">
	  <!-- <div class="modal fade" id="modal" tabindex="10" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
     <div class="modal-dialog">
       <div class="modal-content">
         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
           <h4 class="modal-title" id="myModalLabel">选择组织</h4>
         </div>
         <div class="modal-body">
              <el-table :data="gridData" border>
                  <el-table-column property="mingcheng" label="_组织名称_"></el-table-column>
                  <el-table-column property="xuan" label="_选择_" width="150"></el-table-column>
                  <el-table-column property="bianma" label="_组织编码_" width="150"></el-table-column>
                  <el-table-column property="fuze" label="_负责人_" width="150"></el-table-column>
                  <el-table-column property="phone" label="_联系电话_" width="150"></el-table-column>
                </el-table>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-primary " data-dismiss="modal" @click="getCheckedNodes">确定</button>
         </div>
       </div>
     </div>
       </div>  -->
     <el-dialog title="_选择组织_" :visible.sync="opendialog">
        <el-table :data="gridData" stripe>
          <el-table-column property="mingcheng" label="_组织名称_" min-width="150"></el-table-column>
          <el-table-column property="xuanze" label="_选择_" align="center" width="150">
			  <template scope="scope">
				  <el-button size="small" type="text" icon="edit"></el-button>
			  </template>
		  </el-table-column>
          <el-table-column property="bianma" label="_组织编码_" align="center" width="180"></el-table-column>
          <el-table-column property="fuze" label="_负责人_" align="center" width="180"></el-table-column>
          <el-table-column property="phone" label="_联系电话_" align="center" width="180"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>
<script>
  export default {
   
    methods: {

    },
    mounted(){
      
    },
    props:['isOpenDialog'],
    data(){
      return {
		  opendialog:this.isOpenDialog,
        gridData: [
			{
			  mingcheng: '五六联盟',
			  xuan: '王小虎',
			  bianma: '001',
			  fuze: '王小虎',
			  phone: '13526457891',
        	},
			{
				mingcheng: '五六联盟',
				xuan: '王小虎',
				bianma: '001',
				fuze: '王小虎',
				phone: '13526457891',
			},
			{
				mingcheng: '五六联盟',
				xuan: '王小虎',
				bianma: '001',
				fuze: '王小虎',
				phone: '13526457891',
			},
			{
				mingcheng: '五六联盟',
				xuan: '王小虎',
				bianma: '001',
				fuze: '王小虎',
				phone: '13526457891',
			},
			{
				mingcheng: '五六联盟',
				xuan: '王小虎',
				bianma: '001',
				fuze: '王小虎',
				phone: '13526457891',
			},
		],
      };
    },
	  watch:{
		  isOpenDialog(val) {
			  this.opendialog = val;//新增result的watch，监听变更并同步到dialogzuzhi上
		  },
		  opendialog(val){
			  this.$emit("on-result-change",val);//组件内对opendialog变更后向外部发送事件通知
		  }
	  },

  };
</script>
<style scoped>
 .modal-dialog{
  width:1000px;
  position:absolute;
  top:100px;
  left:200px;
  z-index:99;
}
</style>