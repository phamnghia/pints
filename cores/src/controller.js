const {
	AppLogger, 
	AppValidator,
	AppValidationRule
} 														= require("pints/utils");
const AppException 						= require("./exception");
const CustomException 				= require("./custom_exception");
const AppExceptionHandler 		= require("./exception_handler");

module.exports = class AppController {
	/**
	 *AppController constructor
	 * + router
	 * + log
	 * + validate
	 * @memberof AppController
	 */
	constructor(){
		this.validationRules = this.rules();

		// Router
		this.router = require("express").Router();
		this.route(this.router);

		// Variables
		this.$logger = AppLogger;
		this.$import = this.import();

		// Validate
		this.rules();
	}

	route(r){}
	rules(){return {}}
	import(){
		return {};
	}

	getRouter(){
		return this.router;
	}

	async callAsync(funcs, res){
		try{

			if(typeof funcs.try == "function"){
				await funcs.try()
			} else {
				throw new AppException("INVALID_ASYNC_PROCESS_ARGS");
			}

		} catch(err){
			if(typeof funcs.catch == "function"){
				await funcs.catch(err);
			} else {
				(new AppExceptionHandler(err)).withResponse(res).handle();
			}
		} finally {
			if(typeof funcs.finally == "function") funcs.finally();
		}
	}

	call(funcName){
		return function(req, res){
			let validator = new AppValidator;

			if(!this[funcName]) throw new AppException("FUNCTION_NOT_FOUND");

			this.callAsync({
				try : () => this[funcName](req, res, validator),
				catch : null,
				finally : null
			}, res);
		}.bind(this)
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

	getValidationRule(name){
		if(!this.validationRules[name]) this.throw("VALIDATE_RULE_NOT_FOUND", `Validate rule '${name}' is not defined`);

		let validationRule = new AppValidationRule(name, this.validationRules[name].rules);

		if(this.validationRules[name].require) {
			let requireMessage = this.validationRules[name].require_message ? this.validationRules[name].require_message : AppLang("DEFAULT_REQUIRED_MSG", name);
			validationRule.require(requireMessage);
		}

		return validationRule;
	}

	createValidationRule(name, validationConfig){
		let validationRule = new AppValidationRule(name, validationConfig.rules);

		if(validationConfig.requrie){
			let requireMessage = validationConfig.require_message ? validationConfig.require_message : AppLang("DEFAULT_REQUIRED_MSG", name);
			validationRule.require(requireMessage);
		}
		
		return validationRule;
	}
};