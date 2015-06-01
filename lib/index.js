'use strict';
import escape from './tool_escape';
const PLACE_HOLDER = '#$_=+';

let tmpl = {
  render(str, obj) {
    let datas = [];
    //normal
    let tpl = str.replace(/{%([\s\S]+?)%}/g, (match, code) => {
        let data;
        if (undefined === (data = obj[code])) throw new Error(`property: ${code} is not defined`);
        datas.push(escape(data));
        return PLACE_HOLDER;
      })
      //unescaped
      .replace(/<%([\s\S]+?)%>/g, (match, code) => {
        datas.push(code);
        return PLACE_HOLDER;
      });
    datas.unshift({
      raw: escape(tpl).split(PLACE_HOLDER)
    });
    return String.raw.apply(null, datas);
  },
};

export default tmpl;
