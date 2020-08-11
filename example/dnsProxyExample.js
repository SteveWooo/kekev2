async function main(){
    // 注意引入swc文件路径。
    await require(`${__dirname}/../swc`)();
    let swc = global.swc;
    
    await swc.registerService({
        serviceName : 'dnsProxy',
        path : `${__dirname}/../src/services/dnsProxy/service`
    })

    await swc.services['dnsProxy'].startup({
        callbackFunction : async function(data){
            // console.log(data)
        }
    })
    
}
main();