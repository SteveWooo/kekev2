/**
* 没有需要传入的参数
* 但是需要业务在models/mysql/definedModel里面定义数据模型
*/
const Sequelize = require("sequelize");
module.exports = async (options)=>{
	let swc = global.swc;
	var seq = new Sequelize(swc.config.mysql.database, swc.config.mysql.user, swc.config.mysql.password, {
		host : swc.config.mysql.host,
		dialect : "mysql",
		port : swc.config.mysql.port || 3306,
		pool : {
			max : 5,
			min : 0,
			acquire : 30000,
			idle : 10000,
		},
		define: {
	    	timestamps: false
	 	},
	 	logging : false
	})
	//检查连接情况
	try{
		var res = await seq.authenticate();
	}catch(e){
		throw "Unable to connect database :" + e.message
	}
	swc.dao.seq = seq;

	swc.log.info('初始:dao初始化成功')
	global.swc = swc;
	return {};
}