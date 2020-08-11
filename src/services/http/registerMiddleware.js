/**
* @param options.moduleName 中间件名称
* @param options.path 中间件路径

* @param options.middlewareFilePath 中间件文件夹路径。如果有这玩意，优先递归去注册他们。
*/
const fs = require('fs');
async function registerMiddleware(options){
	let swc = global.swc;
	/**
	* 检查是否有重名中间件存在，有的话报错。
	*/
	if(swc.middlewares[options.moduleName] !== undefined){
		throw await swc.Error({
			code : '50005',
			message : `${options.moduleName} 中间件名称重复,位置：${options.filePath}`
		});
		return ;
	}
	swc.log.info('注册中间件:' + options.moduleName);
	swc.middlewares[options.moduleName] = options.module;
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
			await registerMiddleware({
				module : m,
				filePath : `${options.filePath}/${dirs[i]}`,
				dirStack : options.dirStack,
				middlewareFilePath : options.middlewareFilePath,
				moduleName : options.dirStack.length == 0 ? 
					dirs[i].replace('.js', '') : 
					options.dirStack.join('/') + '/' + dirs[i].replace('.js', ''),
			})
		} else {
			var nextDirStack = Array.from(options.dirStack);
			nextDirStack.push(dirs[i]);
			var nextOptions = {
				filePath : `${options.filePath}/${dirs[i]}`,
				middlewareFilePath : options.middlewareFilePath,
				dirStack : nextDirStack
			}
			await travelServiceFiles(nextOptions);
		}
	}

	global.swc = swc;
	return {};
}

module.exports = async function(options){
	let swc = global.swc;
	/**
	* 如果是传了整体目录进来，那就去搞整个目录下来
	*/
	if(options.middlewareFilePath !== undefined){
		options.filePath = options.middlewareFilePath;
		options.dirStack = [];
		await travelServiceFiles(options);
		return {};
	}

	/*
	* 单个中间件注册（迟早废弃
	*/
	swc.middlewares[options.moduleName] = require(options.path);
	swc.log.info('注册中间件:' + options.moduleName);
	global.swc = swc;
	return {};
}