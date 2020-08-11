/**
* @param.httpServiceFilePath 相对服务根目录下的http服务的目录位置。因为要去那里遍历所有路由 
*/
const fs = require('fs');
const path = require('path');
/**
* @param.module httpservice文件模块 
*/
async function registerHttpService(options){
	let swc = global.swc;
	if(!options.module){
		swc.log.error(`http服务载入失败:文件缺少模块输出，
	位置->${options.filePath}`);
		throw '';
	}
	var m = options.module;
	if(!m.config){
		swc.log.error(`http服务载入失败:文件缺少配置,
	位置->${options.filePath}`);
		throw '';
	}

	if(!m.service){
		swc.log.error(`http服务载入失败:文件缺少服务中间件,
	位置->${options.filePath}`);
		throw '';
	}

	var middlewares = [];
	/**
	* 前置处理中间件
	*/
	middlewares.push(await require(`${__dirname}/../../middlewares/httpCommon/preHandle`)({
		config : m.config
	}));
	
	/**
	* 业务配置中间件
	*/
	if(m.config.middlewares){
		for(var i=0;i<m.config.middlewares.length;i++){
			// middlewares.push(require(`${__dirname}/../../middlewares/${m.config.middlewares[i]}`));
			middlewares.push(swc.middlewares[m.config.middlewares[i]]);
		}
	}
	
	/**
	* 业务主体
	*/
	middlewares.push(m.service);
	swc.log.info(`载入路由 ${m.config.method} ${m.config.path}`);
	
	/**
	* 后置处理中间件
	*/
	middlewares.push(await require(`${__dirname}/../../middlewares/httpCommon/afterHandle`)({
		config : m.config
	}));
	
	swc.app[m.config.method]('/' + swc.config.httpServer.bussinessName + m.config.path, ...[middlewares]);

	global.swc = swc;
	return {};
}

/**
* @param.filePath 当前遍历路径
*/
async function travelServiceFiles(options){
	let swc = global.swc;
	var dirs = fs.readdirSync(options.filePath);
	for(var i=0;i<dirs.length;i++){
		var stat = fs.statSync(`${options.filePath}/${dirs[i]}`);
		if(stat.isFile()){
			var m = require(`${options.filePath}/${dirs[i]}`);
			await registerHttpService({
				module : m,
				filePath : `${options.filePath}/${dirs[i]}`
			})
		} else {
			var nextOptions = {
				filePath : `${options.filePath}/${dirs[i]}`
			}
			await travelServiceFiles(nextOptions);
		}
	}

	global.swc = swc;
	return {};
}

module.exports = async function(options){
	let swc = global.swc;
	swc.log.info('载入 http路由')
	await travelServiceFiles({
		filePath : options.httpServiceFilePath
	})
	global.swc = swc;
	return {};
}