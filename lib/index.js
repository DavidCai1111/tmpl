'use strict';
import escape from './tool_escape';
const PLACE_HOLDER = '#$_=+';
const IF_VALIDATION_FAILED_TOKEN = '__IF_VALIDATION_FAILED_TOKEN__';
const END_IF_TOKEN = '__END_IF_TOKEN__';

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
          if (!obj[code]) {
            IfStatus.set('ignored', true);
            return IF_VALIDATION_FAILED_TOKEN;
          }
        } else if (code.indexOf('endif') !== -1) {
          if (IfStatus.get('ignored')) {
            IfStatus.set('ignored', false);
            return END_IF_TOKEN;
          };
        }
        return '';
      });
    while (tpl.indexOf(IF_VALIDATION_FAILED_TOKEN) !== -1) {
      let start = tpl.indexOf(IF_VALIDATION_FAILED_TOKEN);
      let end = tpl.indexOf(END_IF_TOKEN);
      if (end === -1) throw new Error(`'if statement' is not closed`);
      tpl = tpl.substr(0, start) + tpl.substr(end + END_IF_TOKEN.length);
    }
    datas.unshift({
      raw: tpl.split(PLACE_HOLDER)
    });
    return String.raw.apply(null, datas);
  }
};

export default tmpl;
