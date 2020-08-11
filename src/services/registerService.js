module.exports = async function(options){
	let swc = global.swc;
	swc.services[options.serviceName] = require(options.path);
	swc.log.info('注册服务:' + options.serviceName);
	global.swc = swc;
	return {};
}