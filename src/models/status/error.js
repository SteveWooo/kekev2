const ERROR_CODE = {
	//对外http接口
	'4003' : '登陆失败、无权访问',
	'4004' : '查询不存在',
	'4005' : '参数错误或缺少参数',
	'4006' : '业务不存在',
	'4007' : '缓存过期',
	'5000' : '系统查询错误',
	'6001' : '微信接口请求失败',

	//对内业务
	'50005' : '重名错误',
	'40003' : '账号或密码错误',
	'40005' : '函数传参错误',
	'40006' : '关联对象不存在'
}

/**
 * 统一报错输出
 * @param message 输入信息
 * @param code 错误编码，必须存在ERROR_CODE中咯 
 *
 * @return {code, message, error_message} //考虑到前端也用这套错误编码规范，所以用下划线命名规则
 */
module.exports = async (options)=>{
	if(!options || !options.code){
		swc.log.error('参数缺失（错误模型都报错了，我能怎么办？）');
		throw '';
		return ;
	}

	if(!options.code in ERROR_CODE){
		swc.log.error('错误码未定义（错误模型都报错了，我能怎么办？）');
		throw '';
		return ;
	}

	return {
		code : options.code,
		message : options.message,
		error_message : ERROR_CODE[options.code]
	}
}