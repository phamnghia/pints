const { AppLogger } = require("@pints/utils");
const AppException = require("./exception");

module.exports = class AppExceptionHandler{
	constructor(err){
		this.$error = this.parseError(err);
		this.writeLogFile = true;
	}

	parseError(err){
		if(!err.type){
			err = new AppException("UNDEFINED_EXCEPTION", err.message, err.stack);
		}
		return err;
	}

	withResponse(res){
		this.$res = res;
		return this;
	}

	writeLogFile(isWriteLog){
		this.isWriteLog = isWriteLog;
		return this;
	}

	handle(){
		let originalStack = "";		
		if(this.$error.getOriginal() instanceof Object){
			originalStack = JSON.stringify(this.$error.getOriginal());
		} else {
			originalStack = this.$error.getOriginal();
		}
		AppLogger.error(
			`
${this.$error.stack}
---
${originalStack} | trace: ${this.$error.trace || ""}
---
			`, 
			this.isWriteLog
		);

		if(this.$res) this.$res.json(this.$error.toObject());
	}
}