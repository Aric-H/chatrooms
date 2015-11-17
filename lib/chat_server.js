var societio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var nameUsed = [];
var currentRoom = {};

exports.listen = function(server){
	//启动socket.io服务器，允许它搭载在已有的HTTP服务器上
	io = societio.listen(server);
	io.set('log level',1);
	//定义每个用户连接的处理逻辑
	io.sockets.on('connection',function(socket){
		//在用户连接上来时赋予其一个访客名
		guestNumber = assignGuestName(socket,guestNumber,nickNames,nameUsed);
		//在用户连接上来时把他放入聊天室Lobby里
		joinRoom(socket,'Lobby');
		//处理用户的消息、更名以及聊天室的创建和变更
		handleMessageBroadcasting(socket,nickNames);
		handleNameChangeAttempts(socket,nickNames,nameUsed);
		handleRoomJoining(socket);
		//用户发出请求时，向其提供已经被占用的聊天室列表
		socket.on('rooms',function(){
			socket.emit('rooms',io.sockets.manager.rooms);
		});
		//定义用户断开连接后的清楚逻辑
		handleClientDisconnection(socket,nickNames,nameUsed);
	});
}
