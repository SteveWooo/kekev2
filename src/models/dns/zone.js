/**
* js Object => dns Record
*/
exports.build = async function(swc, options){
	var file = [];
	var zone = options.zone;

	for(var i=0;i<zone.length;i++){
		var rrFile = await swc.models.dns.rr.build(swc, zone[i]);
		file.push(rrFile);
	}

	//SOA rr
	file = ['.	86400	IN	SOA	a.root-servers.net.	mail	2019061702	1800	900	604800	86400'].concat(file);
	//last line
	file.push('\n');

	return {
		file : file.join('\n'),
	}
}

/**
* dns Record => js Object
* @param zoneFile
*/
exports.parse = async function(swc, options){
	var zoneFile = options.zoneFile;
	zoneFile = zoneFile.split('\n');
	zoneFile.splice(0, 1); //remove SOA

	var zoneData = [];

	for(var i=0;i<zoneFile.length;i++){
		var temp = zoneFile[i].split('\t');

		var flag = true;
		for(var k=0;k<5;k++){
			if(temp[k] == undefined){
				flag = false;
				continue;
			}
		}
		if(!flag){
			continue;
		}
		
		var rr = {
			domain : temp[0],
			ttl : temp[1],
			class : temp[2],
			type : temp[3],
			record : temp[4]
		}
		
		rr = await swc.models.dns.rr.create(swc, rr);
		zoneData.push(rr);
	}
	
	return {
		zoneData : zoneData
	}
}