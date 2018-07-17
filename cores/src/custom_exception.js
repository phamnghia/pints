module.exports = class CustomException extends Error{
	constructor(exception_code, code_number, message, trace){ 
		super();
		this.name 			= exception_code;
		this.code 			= 10000 + code_number;
		this.message 		= message;
		this.trace 			= trace;
		
		this.type 			= this.constructor.name;
	}

	toObject(){
		return {
			name : this.name, code : this.code, message: this.message
		}
	}
}