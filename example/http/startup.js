async function main(){
    // 注意引入swc文件路径。
    await require(`${__dirname}/../../swc`)({
        config : require(`${__dirname}/config.json`)
    });
    let swc = global.swc;
    
    // mysql 模块载入
    await swc.registerMysqlDao({
		path : `${__dirname}/httpDao/mysql.js`
	});

    // http 服务
    await swc.registerHttpService({
        httpServiceFilePath : `${__dirname}/httpModule`
    })

    await swc.services.http.startup();
    
}
main();