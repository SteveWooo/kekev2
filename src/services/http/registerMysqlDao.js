/**
* 没有需要传入的参数
* ）但是需要业务在 services/mysql/definedModel里面定义数据模型
*/
const path = require('path')
module.exports = async (options)=>{
	let swc = global.swc;
	await require(`${__dirname}/../../dao/mysql/init`)();
	await require(`${__dirname}/../../dao/mysql/defineModel`)(options);
	global.swc = swc;
	return {};
}