var querystring = require("querystring"),
	fs = require('fs'),
	formidable = require("formidable");

function start(response){
	console.log("Request start.")
	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
	'<style>*{margin:0px;padding:0px}'+
	'input{'+
	'width:80px;height:30px'+
	'}'+
	'.a-upload,input:last-child {font-size: 1.2em;text-decoration:none;width:80px;height:30px;line-height: 30px;text-align:center;position: relative;cursor: pointer;color: #888;background: #fafafa;border: 1px solid #ddd;border-radius: 4px;overflow: hidden;display: inline-block;*display: inline;*zoom: 1}'+
	'.a-upload  input {position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;filter: alpha(opacity=0);cursor: pointer;}'+
	'.a-upload:hover,input:last-child:hover {color: #444;background: #eee;border-color: #ccc;text-decoration: none;cursor: pointer;}'+
	'input:first-child{float:left;opacity:0}'+
	'input:last-child{float:right;}'+
	'form{width:300px;margin:0px auto;overflow:hidden}'+
	'</style>'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
	'<a href="javascript:;" class="a-upload">'+
    '<input type="file" name="upload" value="choose file">Choose'+
	'</a>'+
    '<input type="submit" value="Submit" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response,request){
	console.log("Request upload.")
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request,function(error,fields,files){
		console.log("parsing done");		
		// fs.renameSync(files.upload.path,"/tmp/test.png");
		
		if (error){
			response.writeHead(400,{"Content-Type":"text/html"});
			response.write("404 Not Found.")
			response.end()
		} 
		var is = fs.createReadStream(files.upload.path);  
		var os = fs.createWriteStream("/tmp/test.png"); 
		if((is||os)==undefined){
			response.writeHead(400,{"Content-Type":"text/html"});
			response.write("404 Not Found.")
			response.end()
		}
		is.pipe(os);  
		is.on('end',function(){  
		    fs.unlinkSync(files.upload.path);  
		});
		response.writeHead(200,{"Content-Type":"text/html"});
		var bdf =  '<html>'+
					'<head>'+
					'<meta http-equiv="Content-Type" content="text/html; '+
					'charset=UTF-8" />'+
					'<style>*{margin:0px;padding:0px;text-align:center;border-radius:3px;}'+
					'input{'+
					'width:80px;height:30px'+
					'}'+
					'.a-upload,input:last-child {float:left;font-size: 1.2em;text-decoration:none;width:80px;height:30px;line-height: 30px;text-align:center;position: relative;cursor: pointer;color: #888;background: #fafafa;border: 1px solid #ddd;border-radius: 4px;overflow: hidden;display: inline-block;*display: inline;*zoom: 1}'+
					'.a-upload  input {position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;filter: alpha(opacity=0);cursor: pointer;}'+
					'.a-upload:hover,input:last-child:hover {color: #444;background: #eee;border-color: #ccc;text-decoration: none;cursor: pointer;}'+
					'input:first-child{float:left;opacity:0}'+
					'input:last-child{float:right;}'+
					'form{width:300px;margin:0px auto;overflow:hidden}'+
					'</style>'+
					'</head>'+
					'<body>';
		response.write(bdf)
		response.write("received img: <br/>");
		response.write("<div style='margin:0 auto;position:relative;text-align:center;width:300px;height:400px;border:solid 2px red;'><img src='/show' style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:300px;max-height:400px;'/></div>");
		bd2 = '<form style="border:solid 0px yellow;width:300px" action="/upload" enctype="multipart/form-data" method="post">'+
			  '<a href="javascript:;" class="a-upload">'+
			  '<input type="file" name="upload" value="choose file">Choose'+
			  '</a>'+
			  '<input style="width:80px;height:30px" type="submit" value="Submit" />'+
			  '</form>'
		response.write(bd2)
		var bde =   '</body>'+
    				'</html>';
		response.write(bde)
		response.end();
	})
}
function show(response){
	console.log("Request show.");
	fs.readFile("/tmp/test.png","binary",function(error,file){
		if(error){
			response.writeHead(500,{"Content-Type":"text/plain"});
			response.write(error + "\n");
      		response.end();
		}else{
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	})
}
exports.start = start;
exports.upload = upload;
exports.show = show;