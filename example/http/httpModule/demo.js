module.exports = {
	config : {
		path : '/api/demo',
		method : 'get',
		middlewares : [],
		model : {
			code : 2000,
			error_message : '',
			data : {}
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = global.swc;

        if (Math.random() > 0.5) {
            req.response.data = {
                hello : 'world',
                query : query
            };
            next();
        } else {
            req.response = await swc.Error({
                code : 5000,
                message : 'message'
            })
			next();
        }
	}
}