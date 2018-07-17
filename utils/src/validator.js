const libValidator = require("validator");

/**
 * Lớp kiểm tra và xác thực input của người dùng
 * 
 * import Validator from "./core/classes/Validator";
 * let body = {name : "Pham Dai Nghia"}; 
 * let validator = new Validator(); 
 * validator.checkArray("name", body.name, [
 * 	["Length", {min: 10, max: 20}, "String length error"],
 * 	["Required", null, "Required"],
 * ]); 
 * console.log(validator.isValid(), validator.getErrors());
 * 
 * @export Validator
 * @class Validator
 */
module.exports = class Validator{
	constructor(){
		this.errors = {};
	}

	/**
	 * Check rules defined in AppValidationRule(@pints/utils/AppValidationRule);
	 *
	 * @param {*} validationRules
	 */
	check(...validationRules){
		for(let validationRule of validationRules){
			validationRule.validate();
			if(validationRule.isError()){
				this.addErrors(validationRule.name, ...validationRule.getErrors());
			}
		}
	}

	/**
	 * Check array
	 *
	 * @param {*} fieldName
	 * @param {*} fieldValue
	 * @param {*} validateArray
	 */
	checkArray(fieldName, fieldValue, validateArray){
		let validateFunc = {};
		let validateArgs = {};
		let validateErrorMsg = null;
		let isValid = false;

		if(validateArray.length == 2){
			// Case I: array length == 2 -> first elem is function and second elem is error message
			validateFunc = validateArray[0];
			validateErrorMsg = validateArray[1]
		} else if(validateArray.length == 3){
			// Case II: array length == 3 -> first elem is function and second elem is error message
			validateFunc = validateArray[0];
			validateArgs = validateArray[1];
			validateErrorMsg = validateArray[2]
		}

		if(validateFunc instanceof Function){
			isValid = validateFunc(fieldValue, validateArgs);
		} else {
			isValid = libValidator[`is${validateFunc}`](fieldValue, validateArgs);
		}

		if(!isValid) this.addError(fieldName, validateErrorMsg);
	}

	/**
	 * Check multiple array
	 *
	 * @param {*} fieldName
	 * @param {*} fieldValue
	 * @param {*} validateArrays
	 */
	checkArrays(fieldName, fieldValue, validateArrays){
		for(let validateArray of validateArrays){
			this.checkArray(fieldName, fieldValue, validateArray);
		}
	}


	/**
	 * Kiểm tra lỗi hay không lỗi
	 * 
	 * @returns boolean
	 * 
	 * @memberOf Validator
	 */
	isValid(){
		return Object.keys(this.errors).length == 0 ? true : false;
	}

	isError(){
		return Object.keys(this.errors).length == 0 ? false : true;
	}

	/**
	 * Trả về toàn bộ lỗi và mã lỗi của validate object
	 * 
	 * @returns Object
	 * 
	 * @memberOf Validator
	 */
	getErrors() {
		return Object.keys(this.errors).length > 0 ? this.errors : null;
	}

	addError(fieldName, error){
		if(!this.errors[fieldName]) this.errors[fieldName] = [];
		this.errors[fieldName].push(error);
	}

	addErrors(fieldName, ...errors){
		if(!this.errors[fieldName]) this.errors[fieldName] = [];
		this.errors[fieldName] = this.errors[fieldName].concat(errors);
	}

}