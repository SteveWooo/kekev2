/**
* @param options.items[] 静态目录列表
* @param item.path 路由
* @param item.staticFilePath 静态文件相对项目根目录的地址
*/
const express = require('express');
module.exports = async function(options){
	let swc = global.swc;
	var items = options.items;

	for(var i=0;i<items.length;i++){
		swc.app.use(items[i].path, express.static(items[i].staticFilePath));
		swc.log.info(`载入:静态文件目录${items[i].staticFilePath}, 
		http路由${items[i].path}`);
	}
	global.swc = swc;
	return {};
}