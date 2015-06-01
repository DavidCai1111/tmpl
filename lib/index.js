let render = function(str, data) {
  let tpl = str.replace(/{%([\s\S]+?)%}/g, (match, code) => {
    return `' + obj.${code.trim()}`;
  });
  tpl = `var tpl = '${tpl} \nreturn tpl`;
  console.log(tpl);
  let complied = new Function('obj', tpl);
  return complied(data);
};

console.log(render('hello {%username%}', {
  username: 'DavidCai'
}));
