/**
 * Author : Create by SteveWooo at 2020/8/11
 * Updated: 2020/8/11
 * Email  : SteveWoo23@gmail.com
 * Github : https://github.com/stevewooo
 */

const path = require('path');
/**
* 拿进程参数
* @param -config 配置文件位置
* @param -core : 进程数
* @param -syncDB : 是否同步数据库
*/
async function getArgv(){
	var argv = {};
	for(var i=2;i<process.argv.length;i++){
		if(process.argv[i].indexOf("-") == 0){
			argv[process.argv[i].replace("-","")] = process.argv[i + 1];
		}
	}

	//默认两条进程
	if(!argv.core){
		argv.core = 2;
	}

	return argv;
}

/**
* 此处载入配置
*/
async function loadConfig(options){
    let swc = global.swc;
    // 优先载入传入参数中的配置
    if(options && options.config != undefined) {
        swc.config = options.config;
    } else if(swc.argv.config != undefined) {
        swc.config = require(`${path.resolve()}/${swc.argv.config}`);
    } else {
        swc.log.error(`未找到配置文件参数，已使用默认路径下配置`)
        swc.log.error(`${path.resolve()}/config.json`)
        swc.config = require(`${path.resolve()}/config.json`);
    }

    global.swc = swc;
	return {};
}

/**
* load express middlewares
* )需要在服务启动之前再添加这些配置。
*/
async function loadExpressMiddlewares(){
    const bodyParser = require("body-parser");
    const session = require('express-session');
    let swc = global.swc;
	swc.app.all('*', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', 'https://deadfishcrypto.com');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		next()
	})

	swc.app.all('*.png', function(req, res, next){
		res.header('Cache-Control', 'public, max-age=86400');
		next();
	})

	swc.app.all('*.jpg', function(req, res, next){
		res.header('Cache-Control', 'public, max-age=86400');
		next();
	})

	swc.app.all('*.jpeg', function(req, res, next){
		res.header('Cache-Control', 'public, max-age=86400');
		next();
	})

	swc.app.all('*.js', function(req, res, next){
		res.header('Cache-Control', 'public, max-age=86400');
		next();
	})

	swc.app.all('*.css', function(req, res, next){
		res.header('Cache-Control', 'public, max-age=86400');
		next();
	})

	swc.app.use(bodyParser.urlencoded({extended: false}));
	if(swc.config.httpServer.jsonOnly == true) {
        swc.app.use(bodyParser.json({"limit":"10000kb"}));
    }
	swc.app.use(session({
		secret: 'secret', 
		cookie: {
			maxAge: 60000
		},
		saveUninitialized: true,
		resave: false,
	}));
    global.swc = swc;
	return {};
}

async function loadHttp(){
    const express = require("express");
    let swc = global.swc;

    swc.app = express();
    swc.registerHttpService = require(`${__dirname}/src/services/http/registerHttpService`);
    swc.registerMiddleware = require(`${__dirname}/src/services/http/registerMiddleware`);
    swc.registerMysqlDao = require(`${__dirname}/src/services/http/registerMysqlDao`);
    swc.registerStatic = require(`${__dirname}/src/services/http/registerStatic`);

    swc.services.http = {
        startup : async function (){
            swc.app.listen(swc.config.httpServer.port, ()=>{
                swc.log.info(`启动http服务，端口监听：${swc.config.httpServer.port}`);
            })
        }
    }

    await loadExpressMiddlewares(swc);
	swc.log.info('载入:express中间件');

    global.swc = swc;
    return {}
}

/**
 * 负责加载一些不需要额外依赖的通用工具库
 */
async function loadCommonUtils(){
    let swc = global.swc;

    // DNS库
    swc.utils.dns = {
        parseRequest : require(`${__dirname}/src/utils/common/dns/parseRequest`)
    }

    // 排序工具
    swc.utils.sort = {
        dicSort : require(`${__dirname}/src/utils/common/sort/dicSort`)
    }

    // 加密、转换工具
    swc.utils.crypto = {
        base64 : require(`${__dirname}/src/utils/common/crypto/base64`)
    }

    global.swc = swc;
    return {};
}

/**
* 初始化swc
* @param options {Object} 一些初始化载入的参数，比如载入配置文件数据
*/
async function init(options){
    global.swc = {};
	//初始化控制台输出
	global.swc = {
		/**
		* 服务模式
		* @param dev :开发 (默认)
		* @param prod:生产
		*/
		mode : 'dev',

		/**
		* 控制台IO接口
		* 输入规范: `${操作}:${内容}`
		*/
		log : {
			info : function(msg){
				console.log(new Date() + '\033[42;37mv => ' + msg + '\033[0m ');
			},
			error : function(msg){
				console.log(new Date() + '\033[41;37mx =>  ' + msg + '\033[0m');
			}
		},

		/**
		* 进程参数
		*/
		argv : await getArgv(),
		/**
		* dao
		* 旧版本这个是db
		*/
		dao : {
			seq : {},
			models : {}
		},

		/**
		* 业务对象
		*/
		models : {},

		/**
		* 业务中间件，手动注册去吧。
		*/
		middlewares : {},

		/**
		* 抽象底层工具库
		*/
		utils : {},

		/**
		* 服务
		*/
		services : {},

		/**
		* 统一错误入口
		*/
		Error : require(`${__dirname}/src/models/status/error`),

		/**
		* 控制器载入接口
		*/
        registerService : require(`${__dirname}/src/services/registerService`),
		registerModel : require(`${__dirname}/src/services/registerModel`),
		registerDao : require(`${__dirname}/src/services/registerDao`),
	}
	await loadConfig(options);
    global.swc.log.info('载入 配置');
    
    // 如果配置了http服务，就加载http。这样做是减少模块安装数量。
    console.log(global.swc.config.httpServer.open == true)
    if (global.swc.config.httpServer && global.swc.config.httpServer.open == true) {
        global.swc.log.info(`您已开启http模块，如启动失败，请安装如下依赖`)
        console.log(`npm i express express express-session body-parser sequelize mysql2`)
        await loadHttp();
    }

    // 加载不需要额外依赖的通用工具。
    await loadCommonUtils();
    global.swc.log.info('载入 通用工具');

	return {};
}
module.exports = init;