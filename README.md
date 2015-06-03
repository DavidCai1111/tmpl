# tmpl
a tiny&amp;simple template engine with ES6 DNA

[![Build Status](https://travis-ci.org/DavidCai1993/tmpl.svg?branch=master)](https://travis-ci.org/DavidCai1993/tmpl)
[![Coverage Status](https://coveralls.io/repos/DavidCai1993/tmpl/badge.svg?branch=master)](https://coveralls.io/r/DavidCai1993/tmpl?branch=master)

## installation
via NPM:
> Please use `tmpl` by io.js(v2.1.0 now)
```SHELL
npm isntall node-ts-tmpl --save
```

## Basic Usage
assume that you have an object with the structure like:
```js
{
  username: 'DavidCai',
  isLogin: true,
  lists: [1, 2, 3]
}
```

### variables
```html
<p>hello,{%=username%}</p>
<!--out put:-->
<p>hello,DavidCai</p>
```

### unescaped text
`tmpl` will escape all text you put in {%=...%}, unless you put them in {%!...%}
```html
{%!<p>unescaped</p>%}
<!--out put:-->
<p>unescaped</p>
```

### if statement
```html
{% if login %}
<p>has login!</p>
{% endif %}
<!--out put:-->
<p>has login!</p>
```

### for loop
```html
{% for value in lists%}
<span>{%value%}</span>
{% endfor %}
<!--out put:-->
<span>1</span>
<span>2</span>
<span>3</span>
```

## API
### render(tmpl_html, obj) String
__options:__

* `tmpl_html`: html file with the `tmpl` statement
* `obj`: object to fill the `tmpl` statement

