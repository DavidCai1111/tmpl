'use strict';

var render = function render(str, data) {
  var tpl = str.replace(/{%([\s\S]+?)%}/g, function (match, code) {
    return '\' + obj.' + code.trim();
  });
  tpl = 'var tpl = \'' + tpl + ' \nreturn tpl';
  console.log(tpl);
  var complied = new Function('obj', tpl);
  return complied(data);
};

console.log(render('hello {%username%}', {
  username: 'DavidCai'
}));