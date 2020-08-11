const Sequelize = require("sequelize");
exports.defineModel = async function defineModel(){
    let swc = global.swc
	swc.dao.models.users = swc.dao.seq.define("users", {
		user_id : {type : Sequelize.STRING(32)}, //唯一ID
		nick_name : {type : Sequelize.TEXT}, //昵称
		avatar_url : {type : Sequelize.TEXT},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING(13)},
		update_at : {type : Sequelize.STRING(13)},
    })
    global.swc = swc;
	return {};
}

exports.defineIndex = async function defineIndex(){
    let swc = global.swc;
	// swc.dao.models.demos.belongsTo(swc.dao.models.users, {
	// 	foreignKey : 'create_by', // 数量多的一个数据实体，比如用户发的新闻数据
	// 	targetKey : 'admin_id', // 数量少的一个数据实体，比如用户
	// 	as : 'admin'
	// })
    swc.log.info('载入:数据索引');
    global.swc = swc;
	return {};
}