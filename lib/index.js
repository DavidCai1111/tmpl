'use strict';
import escape from './tool_escape';
const PLACE_HOLDER = '#$_=+';

let tmpl = {
  render(str, obj) {
    let datas = [];
    let IfStatus = new Map([
      ['ignored', false],
      ['store', []]
    ]);
    let isInFor = false;
    //normal
    let tpl = str.replace(/{%=([\s\S]+?)%}/g, (match, code) => {
        let data;
        if (undefined === (data = obj[code])) throw new Error(`property: ${code} is not defined`);
        if (IfStatus.get('ignored')) return;
        datas.push(escape(data));
        return PLACE_HOLDER;
      })
      //unescaped code
      .replace(/{%!([\s\S]+?)%}/g, (match, code) => {
        datas.push(code);
        return PLACE_HOLDER;
      })
      //logical code
      .replace(/{%([\s\S]+?)%}/g, (match, code) => {
        let ifPos;
        if ((ifPos = code.indexOf(' if ')) !== -1) {
          code = code.substr(ifPos + 4).trim();
        } else if (code.indexOf('endif') !== -1) {
          IfStatus.set('ignored', false);
        }
        return '';
      });
    datas.unshift({
      raw: tpl.split(PLACE_HOLDER)
    });
    return String.raw.apply(null, datas);
  }
};

export default tmpl;
