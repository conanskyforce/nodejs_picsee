
function route(handle,pathname,response,request){
	console.log("a request for "+pathname);
	if(typeof(handle[pathname])==='function'){
		handle[pathname](response,request);
	}else{
		console.log("no handler for "+pathname);
		response.writeHead(404,{"Content-Type":"text/plain"})
		response.write("404 Not Found.")
		response.end();
	}
}

exports.route = route;