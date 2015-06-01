'use strict';
import vm from 'vm';

let render = function(str, obj) {
  const PLACE_HOLDER = '__,<|&&|>,__';
  let datas = [];
  let tpl = str.replace(/{%([\s\S]+?)%}/g, (match, code) => {
    datas.push(obj[code.trim()]);
    return PLACE_HOLDER; //占位符
  });
  datas.unshift({
    raw: tpl.split(PLACE_HOLDER)
  });
  return String.raw.apply(null, datas);
};

console.log(render('hello {%username%}, {%username%}!', {
  username: 'DavidCai'
}));
