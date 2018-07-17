const express = require("express");
const http = require('http');


const AppController = require("./controller");
const AppException = require("./exception");
const CustomException = require("./custom_exception");
const {AppLogger} = require("pints/utils");
const {SocketFactory} = require("pints/socket");

module.exports = class Application{
  /**
   * Application constructor
   * @param {*} options
   * 
   * -- options.port: express http port
	 * -- options.socket: boolean - is use socket
   */
  constructor(){
		// Bind default variables
		this.port 							= this.config().port;
		this.use_socket 				= this.config().use_socket;
		this.validationRules 		= this.config().rules;
		this.expressModules 		= this.http();
		this.socketEvents 			= this.config().use_socket ? this.io() : {};
		
		// Custom variables
		this.$logger 						= AppLogger;
		this.$express 					= express();
		this.$server						= http.Server(this.$express);
		this.$io 								= this.use_socket ? this.$io = require('socket.io')(this.$server) : null;
		this.$socketFactory 		= this.use_socket ? SocketFactory.getInstance(this.$io) : null;

		this.depends();

		// Register express modules
		this.$server.listen(this.port, () => {
			this.$logger.success(`Application is running on port ${this.port}`)

			for(let m of this.expressModules){
				this.addExpressModule(m.endpoint, m.module);
			}

			// Binding socket  events
			if(this.use_socket){
				this.$logger.success(`Socket.io is enabled`);
				
				this.$io.on("connection", socket => {
					for(let e of this.socketEvents){
						let listener = new e.listener(socket, this.$io, this.$socketFactory);
						socket.on(e.event, listener.listen.bind(listener));
					}
				})
			}
		});
	}

	/**
	 * Load default configs
	 *
	 * @returns
	 */
	config(){ return {}; }

	/**
	 * HTTP Module Importhtt
	 * @returns Array
	 * @example 
	 * [
	 * 		{endpoint : "/", module: require("./controllers/main")},
	 *		{endpoint : "/test", module: require("./controllers/test")}
	 * ]
	 */
	http(){ return [];}

	/**
	 * Additional validate rule import
	 * @returns Object
	 * @example 
	 * {
	 * username : [
				["Required", null, AppLang("USERNAME_REQUIRED")],
				["Length", {min: 6, max: 32}, AppLang("INVALID_USERNAME_LENGTH")]
			]
	 * }
	 */
	rules(){ /* VALIDATE RULES */ }

	/**
	 * Setup socket listener
	 * @returns Array
	 * @example
	 * [
	 *	{event : "news", listener : require("./events/news")} //With require("./events/news") is SocketIOListener
	 * ]
	 */
	io(){ return []; }

	/**
	 * Depend functions -> run before regsiter http and io
	 *
	 */
	depends(){}

	/**
	 * Run after all setup finished
	 *
	 */
	run(){ }

	/**
	 * Create app instance of return if this.instance exists
	 *
	 * @static
	 * @returns
	 */
	static createInstance(){
    if(this.instance){
      throw new Error("Application already created!!!");
    } else {
      this.instance = new this()
      return this.instance;
    }
  }

	/**
	 *Load config from file
	 *
	 * @static
	 * @param {*} path
	 */
	static loadConfig(path){
    global.app_configs = Object.assign({}, global.app_configs, require(path));
  }

	/**
	 * Load language from file
	 *
	 * @static
	 * @param {*} path
	 */
	static loadLanguage(path){
    global.app_langs = Object.assign({}, global.app_langs, require(path));
	}
	/**
	 * Load exceptions config from file
	 *
	 * @static
	 * @param {*} path
	 */
	static loadException(path){
		global.app_exceptions = Object.assign({}, global.app_exceptions, require(path));
	}

	/**
	 * Get singleton instance of app
	 *
	 * @static
	 * @returns
	 */
	static getInstance(){
    return this.instance;
	}

	/**
	 * Register new http controller
	 *
	 * @param {*} endpoint : absolute path
	 * @param {*} module : AppController
	 * @returns
	 */
	addExpressModule(endpoint, module){
		if(module instanceof AppController){
			this.$express.use(endpoint, module.getRouter());
	
			// Import validate rules
			if(module.$import.rules && module.$import.rules instanceof Array){
				for(let rule of module.$import.rules){
					if(!this.getValidationRuleConfig(rule)) this.throw("VALIDATE_RULE_NOT_FOUND", `Validate rule '${rule}' is not defined`);
	
					module.addValidationRule(rule, this.getValidationRuleConfig(rule));
				}
			}
	
			return this;
		} else {
			this.throw("INVALID_HTTP_MODULE")
		}

	}

	setStaticFolder(endpoint, folder){
		this.$express.use(endpoint, express.static(folder));
	}
	
	// Socket Funcs
	getUsers(){
		this.$socketFactory.getUsers()
	}

	getUserSockets(username){
		this.$socketFactory.getUserSockets(username)
	}

	hasUser(username){
		this.$socketFactory.hasUser(username);
	}

	addUser(username, socket){
		this.$socketFactory.addUser(username, socket);
	}

	addSocketToUser(username, socket){
		this.$socketFactory.addSocketToUser(username, socket);
	}

	removeUserSocket(username, socket){
		this.$socketFactory.removeUserSocket(username, socket);
	}

	addUserToRoom(roomname, username){
		this.$socketFactory.addUserToRoom(roomname, username);
	}

	removeUserFromRoom(roomname, username){
		this.$socketFactory.removeUserFromRoom(roomname, username)
	}

	emitToRoom(roomname, event, ...args){
		this.$socketFactory.emitToRoom(roomname, event, ...args);
	}

	emitToUser(username, event, ...args){
		this.$socketFactory.emitToUser(username, event, ...args);
	}

	emitToAll(event, ...args){
		this.$socketFactory.emitToAll(event, ...args);
	}

	kickUser(username){
		this.$socketFactory.kickUser(username)
	}

	kickSocket(username, socket){
		this.$socketFactory.kickSocket(username, socket);
	}

	// Util Funcs
	throw(exception_code, message, error, trace){
		throw global.app_exceptions[exception_code] ? 
			new AppException(exception_code, message, error, trace) : 
			new AppException("UNDEFINED_EXCEPTION");
	}

	throwCustom(exception_code, code_number, message, trace){
		throw new CustomException(exception_code, code_number, message, trace);
	}

	// Validate Funcs
	addValidationRule(name, rules){
		this.validationRules[name] = rules;
	}

	getValidationRuleConfig(name){
		return this.validationRules[name];
	}
}