/**
* 前置请求定义，注入模型
* @param.config 业务配置
*/
module.exports = async (options)=>{
	return async function(req, res){
		if(req.response.sent === true){
			return ;
		}
		if(!req.response.headers || !('Content-Type' in req.response.headers)){
			res.header("Content-Type", "application/json; charset=utf-8")
		}
		for(var i in req.response.headers){
			res.header(i, req.response.headers[i]);
		}
		delete req.response.headers;
		res.send(JSON.stringify(req.response));
	}
}