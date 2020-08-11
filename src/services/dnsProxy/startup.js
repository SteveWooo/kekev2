const Dgram = require('dgram');
/**
 * 临时使用的配置文件，业务需要时
 */
const CONFIG = {
    listenPort : 53,
    proxyIp : '114.114.114.114',
    proxyPort : 53
}
let config;

/**
 * 把dns数据包转发，或缓存的处理。
 * @param {Object} options.dnsData 解析成Object的dns数据包
 * @param {byte} message 原始DNS数据报文
 * @param {Object} remote 发送源信息
 */
async function transDnsPack(options) {
    let swc = global.swc;
    let now = +new Date();
    /**
     * 请求包需要缓存，目的是响应的时候能找到对应的ID和源头。缓存过期为20秒，为保持配置简洁暂时写死，如需复用，必须写入配置
     */
    if(options.dnsData.header.qr == '0') {
        // console.log(swc.services['dnsProxy'].requestMap)
        if(options.dnsData.header.id in swc.services['dnsProxy'].requestMap && 
            now - swc.services['dnsProxy'].requestMap[options.dnsData.header.id].createAt <= 20000) {
            swc.log.error(`DNS id冲突，数据包废弃。`);
            return await swc.Error({
                code : '50006'
            });
        }

        // 请求包需要缓存，等待响应
        swc.services['dnsProxy'].requestMap[options.dnsData.header.id] = {
            createAt : now,
            remote : options.remote,
            requestDnsData : options.dnsData,
            requestMessage : options.message
        }

        swc.services['dnsProxy'].socket.send(options.message, config.proxyPort, config.proxyIp, (err)=>{
            if (err) {
                swc.log.error(err.message);
            }
        })
    }

    if(options.dnsData.header.qr == '1') {
        if (swc.services['dnsProxy'].requestMap[options.dnsData.header.id] != undefined) {
            swc.services['dnsProxy'].socket.send(options.message, 
                swc.services['dnsProxy'].requestMap[options.dnsData.header.id].remote.port, 
                swc.services['dnsProxy'].requestMap[options.dnsData.header.id].remote.address, (err)=>{
                if (err) {
                    swc.log.error(err.message);
                }
            })

            delete swc.services['dnsProxy'].requestMap[options.dnsData.header.id];
        } else {
            return await swc.Error({
                code : '40004'
            });
        }
    }

    global.swc = swc;
    return {
        code : 20000,
        message : '已正确转发'
    };
}

/**
 * 注册一个udp4服务，绑定端口，把所有数据按照DNS格式解码，并调用callbackFunction。
 * @param {Object} options.config 客制化配置
 * @param {Function} options.callbackFunction 返回数据
 * @return {Object} null
 */
module.exports = async (options) =>{
    let swc = global.swc;
    if(options.config != undefined) {
        config = options.config
    } else {
        swc.log.info(`参数中未载入DNS proxy服务的配置，已使用默认配置`)
        swc.log.info(`配置路径：${__dirname}`)
        config = CONFIG;
    }

    let socket = Dgram.createSocket('udp4');

    socket.on('message', async function(message, remote) {
        let dnsData = swc.utils.dns.parseRequest({
            msg : message
        })
        // console.log('receive pack')
        // 处理转发报文
        let transStatus = await transDnsPack({
            dnsData : dnsData,
            message : message,
            remote : remote
        })

        await options.callbackFunction({
            dnsData : dnsData,
            remote : remote,
            message : message,
            transStatus : transStatus
        })
    })

    socket.bind(config.listenPort);

    swc.services['dnsProxy'].socket = socket;
    global.swc = swc;
    return {};
}