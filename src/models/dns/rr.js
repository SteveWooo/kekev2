/**
* RR = 其中一条DNS记录
*/
const crypto = require('crypto');
exports.create = async function (swc, options){
	var rr = {
		type : '', //A AAAA CNAME MX NS DS DNSKEY RRSIG
		domain : '', //domain
		ttl : 125800,
		class : 'IN', //almost IN
		record : '', //answer
	}
	for(var i in rr){
		if(!(i in options)){
			throw await swc.Error(swc, {
				code : '40005',
				message : '缺少部分记录信息'
			})
		}

		rr[i] = options[i];
	}
	/**
	* example : type=A, domain='baidu.com', ttl=100, class='IN', record='112.0.100.3'
	* result in DNS :
	* baidu.com.	100	IN	A	112.0.100.3
	*/
	var source = '';
	for(var i in rr){
		source += rr[i];
	}

	rr.key = crypto.createHash('sha1').update(source).digest('hex');
	return rr;
}

/**
* @param.rr 一条RR记录
* @return DNS记录
*/
exports.build = async function(swc, options){
	var dnsRR = [];
	var seq = ['domain', 'ttl', 'class', 'type', 'record'];
	for(var i=0;i<seq.length;i++){
		dnsRR.push(options[seq[i]]);
	}

	return dnsRR.join('\t');
}