module.exports = (lang_code, ...args) => {
  let str = global.app_langs[lang_code];

  if(!str) return lang_code;

  if(args.length > 0){
    for(let i = 1; i <= args.length; i++){
      let arg = args[i-1];
      str = str.replace(new RegExp("\\$\\{"+ i +"\\}", "g"), arg);
    }
  }

  return str;
};