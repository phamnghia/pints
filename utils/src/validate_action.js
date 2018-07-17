module.exports = class AppValidateAction{
	constructor(fieldName, fieldValue, args) {
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
		this.args = args;
		this.errors = [];
	}

	
	/**
	 * Return boolean
	 *
	 */
	validate(){}

	withValue(value){
		this.fieldValue = value;
		return this;
	}

	withName(name){
		this.fieldName = name;
		return this;
	}

	withArgs(args){
		this.args = args;
	}

	// 
	addError(error){
		this.errors.push(error)
	}

	addErrors(...errors){
		this.errors = this.errors.concat(errors);
	}

	getErrors(){
		return this.errors;
	}

	isValid(){
		return this.errors.length == 0
	}

	isError(){
		return this.errors.length != 0;
	}
}
