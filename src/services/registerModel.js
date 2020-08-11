/**
* @param options.modelName 模块名称
* @param options.path 模块路径

* @param options.modelFilePath 模块文件存放路径，递归去搞他们下来了
*/
const fs = require('fs');
async function registerModel(options){
	let swc = global.swc;
	/**
	* 检查是否有重名中间件存在，有的话报错。
	*/
	if(swc.models[options.moduleName] !== undefined){
		throw await swc.Error({
			code : '50005',
			message : `${options.moduleName} 模块名称重复,位置：${options.filePath}`
		});
		return ;
	}
	swc.log.info('注册模块:' + options.moduleName);
	swc.models[options.moduleName] = options.module;
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
			await registerModel({
				module : m,
				filePath : `${options.filePath}/${dirs[i]}`,
				dirStack : options.dirStack,
				modelFilePath : options.modelFilePath,
				moduleName : options.dirStack.length == 0 ? 
					dirs[i].replace('.js', '') : 
					options.dirStack.join('/') + '/' + dirs[i].replace('.js', ''),
			})
		} else {
			var nextDirStack = Array.from(options.dirStack);
			nextDirStack.push(dirs[i]);
			var nextOptions = {
				filePath : `${options.filePath}/${dirs[i]}`,
				modelFilePath : options.modelFilePath,
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
	* 不建议使用
	*/
	if(options.modelFilePath !== undefined){
		options.filePath = options.modelFilePath;
		options.dirStack = [];
		await travelServiceFiles(options);
		return {};
	}

	/**
	* 注册单个模块
	*/
	swc.models[options.modelName] = require(options.path);
	swc.log.info('注册模块:' + options.modelName);
	global.swc = swc;
	return {};
}