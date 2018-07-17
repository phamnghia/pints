const fs = require("fs");

// ----- INIT -----
global.app_configs    = {};
global.app_langs      = {
	DEFAULT_SUCCESS : "Thành công",
	UNDEFINED_EXCEPTION_MSG : "Undefined exception!!!",
	VALIDATE_RULE_NOT_FOUND_MSG : "Could'n found validate rule",
	INVALID_HTTP_MODULE : "Module không đúng định dạng! HTTP Register yêu cầu module thuộc kiểu AppController",
	FUNCTION_NOT_FOUND : "Không tìm thấy function!",
	INVALID_VALIDATE_ACTION_MSG : "Validate action không đúng định dạng cho phép. Định dạng hợp lệ bao gồm: Function, AppValidateAction, Array",
	DEFAULT_REQUIRED_MSG : "Vui lòng nhập ${1}"
};
global.app_exceptions 	= {
	UNDEFINED_EXCEPTION : {code : -9999, message : "UNDEFINED_EXCEPTION_MSG"},
	INVALID_HTTP_MODULE : {code : -1, message : "INVALID_HTTP_MODULE"},
	VALIDATE_RULE_NOT_FOUND : {code : -2, message : "VALIDATE_RULE_NOT_FOUND_MSG"},
	FUNCTION_NOT_FOUND : {code : -3, message : "FUNCTION_NOT_FOUND"},
	INVALID_VALIDATE_ACTION : {code : -4, message : "INVALID_VALIDATE_ACTION_MSG"},
};

const Application 	  = require("./src/application");

// Load config if exist
if(fs.existsSync(`${process.cwd()}/app/includes/config.js`)) 
  Application.loadConfig(`${process.cwd()}/app/includes/config`);

// Load language if exist
if(fs.existsSync(`${process.cwd()}/app/includes/lang.js`)) 
	Application.loadLanguage(`${process.cwd()}/app/includes/lang`);
	
// Load exception if exist
if(fs.existsSync(`${process.cwd()}/app/includes/exception.js`)) 
  Application.loadException(`${process.cwd()}/app/includes/exception`);




// exports
exports.Application   			= Application;
exports.AppLang			  			= require("./src/language");
exports.AppConfig 					= require("./src/config");

exports.AppController 			= require("./src/controller");
exports.AppException  			= require("./src/exception");
exports.CustomException			= require("./src/custom_exception");
exports.AppExceptionHandler	= require("./src/exception_handler");
exports.AppResponse 				= require("./src/response");





