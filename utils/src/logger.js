const log4js = require('log4js');
const clc = require('cli-color');

class AppLogger{
	constructor(){
		log4js.configure({
			appenders: { 
				default 	: {type : "file", filename: process.cwd() + "/logs/default.log" },
				error 		: { type: "file", filename: process.cwd() + "/logs/error.log" },
				api 			: { type: "file", filename: process.cwd() + "/logs/api.log" },
				unhandled : { type: "file", filename: process.cwd() + "/logs/unhandled.log" }
			},
			categories: { 
				default		: { appenders: ["default"], level : "info"},
				error			: { appenders: ["error"], level : "error"},
				api				: { appenders: ["api"], level : "info"},
				unhandled : { appenders: ["unhandled"], level : "error"}
			}
		});
	}

	error(message, writeFile){
		console.log(clc.xterm(124)(`[Pints]   [ERROR]    -> ${(new Date).toLocaleString()}: ${message}`));

		if(writeFile) log4js.getLogger("error").error(`${message}`)
	}

	warn(message, writeFile){
		console.log(clc.yellow(`[Pints]   [WARNING]  -> ${(new Date).toLocaleString()}: ${message}`));

		if(writeFile) log4js.getLogger("default").error(`${message}`)
	}

	info(message, writeFile){
		console.log(clc.blue(`[Pints]   [INFO]     -> ${(new Date).toLocaleString()}: ${message}`))

		if(writeFile) log4js.getLogger("default").error(`${message}`)
	}

	success(message, writeFile){
		console.log(clc.green(`[Pints]   [SUCCESS]  -> ${(new Date).toLocaleString()}: ${message}`))

		if(writeFile) log4js.getLogger("default").error(`${message}`)
	}

	api(message, writeFile){
		console.log(clc.cyan(`[Pints]   [API_LOG]  -> ${(new Date).toLocaleString()}: ${message}`))

		if(writeFile) log4js.getLogger("api").error(`${message}`)
	}

	unhandled(message, writeFile){
		console.log(clc.xterm(124)(`[Pints]   [UNHANDLED]-> ${(new Date).toLocaleString()}: ${message}`));

		if(writeFile) log4js.getLogger("unhandled").error(`${message}`)
	}
}

module.exports = new AppLogger;