async function main(){
    // 注意引入swc文件路径。
    await require(`${__dirname}/../../swc`)();
    let swc = global.swc;
    
    // mysql
    await swc.registerMysqlDao({
		servicePath : `${__dirname}/httpDao/mysql.js`
	});

    // http 服务
    await swc.registerHttpService({
        httpServiceFilePath : `${__dirname}/httpModule`
    })

    await swc.services.http.startup();
    
}
main();