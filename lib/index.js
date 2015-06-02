'use strict';
import escape from './tool_escape';
import util from 'util';

const VARIABLE_PLACE_HOLDER = '__VARIABLE_PLACE_HOLDER__';
const IF_VALIDATION_FAILED_TOKEN = '__IF_VALIDATION_FAILED_TOKEN__';
const END_IF_TOKEN = '__END_IF_TOKEN__';
const FOR_LOOP_START_TOKEN = '__FOR_LOOP_START_TOKEN__';
const FOR_LOOP_END_TOKEN = '__FOR_LOOP_END_TOKEN__'

let tmpl = {
  render(str, obj) {
    let datas = [];
    let ifValidationStatus = false;
    let isInFor = false;
    let forValueSrore = [];
    //normal variable's replacement
    let tpl = str.replace(/{%=([\s\S]+?)%}/g, (match, code) => {
        let data;
        if (undefined === (data = obj[code])) throw new Error(`property: ${code} is not defined`);
        if (ifValidationStatus) return;
        datas.push(escape(data));
        return VARIABLE_PLACE_HOLDER;
      })
      //unescaped code
      .replace(/{%!([\s\S]+?)%}/g, (match, code) => {
        datas.push(code);
        return VARIABLE_PLACE_HOLDER;
      })
      //logical code
      .replace(/{%([\s\S]+?)%}/g, (match, code) => {
        let ifPos;
        //if statement
        if ((ifPos = code.indexOf('if')) !== -1 && code.indexOf('endif') === -1) {
          code = code.substr(ifPos + 2).trim();
          if (!obj[code]) {
            ifValidationStatus = true;
            return IF_VALIDATION_FAILED_TOKEN;
          }
        } else if (code.indexOf('endif') !== -1) {
          if (ifValidationStatus) {
            ifValidationStatus = false;
            return END_IF_TOKEN;
          };
          //for loop
        } else if (code.indexOf('for') !== -1 && code.indexOf('endfor') === -1) {
          let forPos = code.indexOf('for');
          let inPos = code.indexOf('in');
          let valueName = code.substr(forPos + 3, inPos - 4).trim();
          code = code.substr(inPos + 2).trim();
          if (!obj[code]) throw new Error(`variable: ${code} is not exist`);
          if (!util.isArray(obj[code])) throw new Error(`variable: ${code} in for loop should be an array`);
          forValueSrore.push({
            name: valueName,
            store: obj[code]
          });
          return FOR_LOOP_START_TOKEN;
        } else if (code.indexOf('endfor') !== -1) {
          return FOR_LOOP_END_TOKEN;
          //in for loop
        } else {
          return match;
        }
        return '';
      });

    while (tpl.indexOf(IF_VALIDATION_FAILED_TOKEN) !== -1) {
      let start = tpl.indexOf(IF_VALIDATION_FAILED_TOKEN);
      let end = tpl.indexOf(END_IF_TOKEN);
      if (end === -1) throw new Error(`'if statement' has not been closed`);
      tpl = tpl.substring(0, start) + tpl.substring(end + END_IF_TOKEN.length);
    }

    while (tpl.indexOf(FOR_LOOP_START_TOKEN) !== -1) {
      let start = tpl.indexOf(FOR_LOOP_START_TOKEN);
      let end = tpl.indexOf(FOR_LOOP_END_TOKEN);
      if (end === -1) throw new Error(`'for loop' has not been closed`);
      let _tpl = tpl.substring(start + FOR_LOOP_START_TOKEN.length, end);
      let data = forValueSrore.shift();
      let resultTpl = '';
      for (let v of data.store) {
        resultTpl += _tpl.replace(new RegExp(`{%${data.name}%}`, 'g'), () => {
          return v;
        });
      }
      tpl = tpl.substring(0, start) + resultTpl + tpl.substring(end + FOR_LOOP_END_TOKEN.length);
    }

    datas.unshift({
      raw: tpl.split(VARIABLE_PLACE_HOLDER)
    });
    return String.raw.apply(null, datas);
  }
};

export default tmpl;
