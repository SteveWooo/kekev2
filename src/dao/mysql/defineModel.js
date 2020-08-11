/**
* @param options.path 索引和数据模型文件的路径。该文件有规定的编写模式，
* 暴露2个api：defineModel和defineIndex
* )需要先定义数据模型，同步到数据库，才能定义索引关系
*/

const Sequelize = require("sequelize");

async function syncDatabase(){
	let swc = global.swc;
	await swc.dao.seq.sync();
	swc.log.info('同步:数据库模型同步到数据库');
	global.swc = swc;
	return {};
}

module.exports = async (options)=>{
	let swc = global.swc;
	var path;
	if(options.path != undefined){
		path = options.path;
	}
	var bussinessModel = require(path);
	// 定义对象
	await bussinessModel.defineModel(swc);
	swc.log.info('载入:数据库模型');
	if(swc.argv.initDB === '1'){
		await syncDatabase();
	}
	// 定义索引
	await bussinessModel.defineIndex(swc);
	global.swc = swc;
	return {};
}