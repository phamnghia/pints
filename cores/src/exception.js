const AppLang = require("./language");

module.exports = class AppException extends Error{
	constructor(exception_code, message, error, trace){ 
		super();
		console.log(exception_code);
		this.name 			= exception_code;
		this.code 			= global.app_exceptions[exception_code].code;
		this.message 		= message ? message : AppLang(global.app_exceptions[exception_code].message);
		this.trace 			= trace;
		this.error 			= error;
		
		this.type 			= this.constructor.name;
	}

	toObject(){
		return {
			name : this.name, code : this.code, message: this.message, error : this.error
		}
	}

	getOriginal(){
		return this.error;
	}
}