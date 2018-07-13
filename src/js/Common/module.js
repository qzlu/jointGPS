/**
 * Created by jiaxin on 2017/9/21.
 */



//确定弹框
this.$confirm('询问内容?', 'title', {
	confirmButtonText: '_确定_',
	confirmButtonClass: "search",
	cancelButtonText: '_取消_',
	cancelButtonClass: "cancel el-button--primary",
	type: 'warning' //类型根据情况选择
}).then(() => {
	//确定操作

}).catch(() => {
	//取消操作
});