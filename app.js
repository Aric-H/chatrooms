//内置的http模块提供了HTTP服务和客户端功能
var http = require('http');
//内置的path模块提供了与文件系统路径相关的功能
var path = require('path');
//内置的fs模块提供了文件的读取、写入、更名、删除、遍历目录、链接等 POSIX 文件系统操作。
var fs = require('fs');
//附加的mime模块有根据文件扩展名得出ＭＩＭＥ类型的能力
var mime = require('mime');
//cache是用来缓存文件内容的对象
var cache = {};

function send404(response,filePath,fileContents){
	response.writeHead(404,{'Content-Type':'text-plain'});
	response.write('Error 404:resource not found');
	response.end();
}

function sendFile(response,filePath,fileContents){
	response.writeHead(
		200,
		{'Content-Type':mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response,cache,absPath){
	//检查文件是否缓存在内存中
	if(cache[absPath]){
		//从内存中返回文件
		sendFile(response,absPath,cache[absPath]);
	}else{
		//检查文件是否存在
		fs.exists(absPath,function(exists){
			if(exists){
				//如果存在,从硬盘中读取文件,err表示错误,data表示文件内容
				fs.readFile(absPath,function(err,data){
					if(err){
						send404(response);
					}else{
						//把文件内容缓存到内存中
						cache[absPath] = data;
						sendFile(response,absPath,data);
					}
				})
			}else{
				//如果文件不存在
				send404(response);
			}
		})
	}
}

//创建HTTP服务器,用匿名函数定义对每个请求的处理行为
var server = http.createServer(function(request,response){
	var filePath = false;
	if(request.url=='/'){
		//确定返回默认的HTML文件
		filePath = 'public/index.html';
	}else{
		//将URL路径转为文件的相对路径
		filePath = 'public'+request.url;
	}
	//绝对路径
	var absPath = './'+filePath;
	serveStatic(response,cache,absPath);
});

//启动服务器监听3000端口
server.listen(3000,function(){
	console.log("Server listening on port 3000");
})