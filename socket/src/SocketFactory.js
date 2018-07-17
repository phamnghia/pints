module.exports  = class SocketFactory{
	constructor(io){
		this.io = io
		this.users = {};
	}

	static getInstance(io){
		if(this.instance){
			return this.instance;
		} else {
			this.instance = new this(io);
			return this.instance
		}
	}

	getSocketServer(){
		return this.io;
	}

	getUsers(){
		return this.users;
	}

	getUserSockets(username){
		return this.users[username];
	}

	hasUser(username){
		return this.users.hasOwnProperty(username);
	}

	addUser(username, socket){
		if(!this.hasUser(username)){
			this.users[username] = [];
			if(socket) this.addSocketToUser(username, socket);
		}
	}

	addSocketToUser(username, socket){
		if(this.hasUser(username)){
			let userSocketArray = this.users[username];
			if(!userSocketArray.includes(socket))
				userSocketArray.push(socket);
		} else {
			this.users[username] = [socket];
		}
	}

	removeUserSocket(username, socket){
		if(this.hasUser(username)){
			let pos = this.users[username].indexOf(socket);
			delete this.users[username].splice(pos, 1);
			if(this.users[username].length == 0) delete this.users[username];
		}
	}

	addUserToRoom(roomname, username){
		for(let socketid of this.getUserSockets(username)){
			this.getSocketServer().sockets.connected[socketid].join(roomname);
		}
	}

	removeUserFromRoom(roomname, username){
		for(let socketid of this.getUserSockets(username)){
			this.getSocketServer().sockets.connected[socketid].leave(roomname);
		}
	}

	emitToRoom(roomname, event, ...args){
		this.getSocketServer().to(roomname).emit(event, ...args);
	}

	emitToUser(username, event, ...args){
		for(let socketid of this.getUserSockets(username)){
			this.getSocketServer().to(socketid).emit(event, ...args);
		}
	}

	emitToAll(event, ...args){
		this.getSocketServer().emit(event, ...args);
	}

	kickUser(username){
		if(this.hasUser(username)){
			let i = 0;
			for(let socket of this.users[username]){
				setTimeout(() => this.getSocketServer().sockets.connected[socket].disconnect(true), 10);
			}
		}
	}

	kickSocket(username, socket){
		if(this.hasUser(username) && this.users[username].includes(socket)){
			setTimeout(() => this.getSocketServer().sockets.connected[socket].disconnect(true), 10);
		}
	}
}