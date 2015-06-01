'use strict';
import vm from 'vm';

const PLACE_HOLDER = '__,<|&&|>,__'; //占位符

let tmpl = {
  render(str, obj) {
    let datas = [];
    let tpl = str.replace(/{%([\s\S]+?)%}/g, (match, code) => {
      datas.push(obj[code.trim()]);
      return PLACE_HOLDER;
    });
    datas.unshift({
      raw: tpl.split(PLACE_HOLDER)
    });
    return String.raw.apply(null, datas);
  }
};

export default tmpl;
