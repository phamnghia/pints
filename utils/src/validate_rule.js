const libValidator = require("validator");
const { AppException } = require("pints/cores");
const AppValidateAction = require("./validate_action");

module.exports = class AppValidationRule {
	constructor(name, actions){
		this.name = name;
		this.isRequired = false;
		this.actions = actions instanceof Array ? actions : [];
		this.errors = [];

		for(let action of this.actions){
			if(!action instanceof Array || !action instanceof AppValidateAction){
				throw new AppException("INVALID_VALIDATE_ACTION");
			}
		}
	}

	require(requireMessage){
		this.isRequired = true;
		this.requireMessage = requireMessage;
	}

	withValue(fieldValue){
		this.fieldValue = fieldValue;
		return this;
	}

	withName(name){
		this.name = name;
		return this;
	}

	// parse action
	parseValidateAction(validateAction){

	}

	parseArray(validateArray){
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
			isValid = validateFunc(this.fieldValue, validateArgs);
		} else {
			isValid = libValidator[`is${validateFunc}`](this.fieldValue, validateArgs);
		}

		return isValid ? null : validateErrorMsg;
	}

	// error funcs
	addErrors(...errors){
		this.errors = this.errors.concat(errors);
	}

	addError(error){
		this.errors.push(error);
	}

	getErrors(){
		return this.errors.length == 0 ? null : this.errors;
	}

	// get status
	isValid(){
		return this.errors.length == 0 ? true : false;
	}

	isError(){
		return this.errors.length == 0 ? false : true;
	}

	// 
	validate(){
		if(this.isRequired && !this.fieldValue){
			this.errors = [this.requireMessage];
		} else {
			for(let validateAction of this.actions){
				let errors = [];
	
				// Process if validate action is AppValidateAction instance
				if(validateAction instanceof AppValidateAction){
					validateAction.withName(this.name).withValue(this.fieldValue).validate();
					errors = validateAction.getErrors();
				}
	
				// Process if validate action is array
				if(validateAction instanceof Array){
					let err = this.parseArray(validateAction);
					if(err) errors.push(err);
				}
	
				// Add action errors to validattion rule errors
				this.addErrors(...errors);
			}
		}
	}
}