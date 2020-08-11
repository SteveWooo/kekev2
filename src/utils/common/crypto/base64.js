/**
* @param base64String 加密字符串
* @return string
*/
exports.decode = async (base64String)=>{
	var buf = Buffer.from(base64String, 'base64');
	var str = buf.toString();
	return str;
}

/**
* @param str String 原文字符串
* @return base64String 加密字符串
*/

exports.encode = async (str)=>{
	var buf = Buffer.from(str);
	var base64String = buf.toString('base64');
	return base64String;
}