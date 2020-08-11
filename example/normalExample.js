async function main(){
    // 注意引入swc文件路径。
    await require(`${__dirname}/../swc`)();
    let swc = global.swc;
    
    console.log(swc);
    // do what you want
    
}
main();