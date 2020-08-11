module.exports = async function(options){
	let swc = global.swc;
	swc.dao[options.daoName] = require(options.path);
	swc.log.info('注册服务:' + options.daoName);
	global.swc = swc;
	return {};
}