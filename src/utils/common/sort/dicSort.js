/**
* @param query {Object}, 参数hash表
* @return array 字段=数据
*/
module.exports = async function (query){
	var result = [];
	for(var key of Object.keys(query).sort()){
		result.push(`${key}=${query[key]}`);
	}
	return result;
} 