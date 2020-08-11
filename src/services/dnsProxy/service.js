/**
 * Author : Create by SteveWooo at 2020/8/11
 * Updated: 2020/8/11
 * Email  : SteveWoo23@gmail.com
 * Github : https://github.com/stevewooo
 */

/**
 * 该服务是一个通用DNS数据包转发服务，业务方只需通过registerService调用次文件即可。
 */
module.exports = {
    startup : require(`${__dirname}/startup`),

    socket : undefined, // dns代理服务的socket

    requestMap : {}, // 用dns请求包的ID做索引，用于做映射
}