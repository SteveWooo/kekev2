/**
* 前置请求定义，注入模型
* @param.config 业务配置
*/
module.exports = async (options)=>{
	return async function(req, res, next){
		let swc = global.swc
		req.swc = swc;
		if(options.config.model){
			req.response = options.config.model;
		} else {
			req.response = {
				code : 2000,
				data : {},
				error_message : ''
			}
		}

		//请求来源
		req.response.source = {
			type : '',
			user_id : ''
		}

		//默认响应头
		req.response.headers = {};
		next();
	}
}