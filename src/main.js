



require("!style!css!./dist/css/AdminLTE.min.css");
require("!style!css!./dist/css/skins/skin-blue.css");
require('!style!css!element-ui/lib/theme-chalk/index.css');
//require('!style!css!element-ui/lib/theme-default/index.css')
require("!style!css!./css/Common/Common.css");
require("!style!css!./font/ds-digi.css");
require("!style!css!./css/Common/el_pager.css");
require("!style!css!./css/Common/el_table.css");
require("!style!css!./css/Common/el_dialog.css");
require("!style!css!./css/Common/report_header.css");
require("!style!css!./css/Common/icon.css");
require("!style!css!./css/Common/admin.css");



require("./bootstrap/js/bootstrap.min.js");
require("./plugins/slimScroll/jquery.slimscroll.min.js");
require("./plugins/hpack/json.hpack.js");
//require("./dist/js/demo.js")
require("./dist/js/app.js");

import Vue from 'vue';
import App from './index.vue';
Vue.use(App);
import Common from "./js/Common/Common.js";
Vue.use(Common);
import AlarmReport  from './js/Common/AlarmReport';
Vue.use(AlarmReport);

import share  from './js/Common/share';
Vue.use(share);

import elementUI from 'element-ui';
Vue.use(elementUI);
import VueResource from "vue-resource";
Vue.use(VueResource);
import aweDND from 'awe-dnd';
Vue.use(aweDND);


/*import {Transfer} from "../node_modules/element-ui@2.2.2";
Vue.use(Transfer);*/

require("./router.js")



$(document).ajaxStart(function() {
	Pace.restart();
});




