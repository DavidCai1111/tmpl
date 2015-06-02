import fs from 'fs';
import path from 'path';
import mocha from 'mocha';
import should from 'should';
import tmpl from '../index';

describe('test tmpl with all features', () => {
  it('test all features', (done) => {
    let html = fs.readFile(path.join(__dirname, './test.html'), (err, content) => {
      if (err) console.error(err);
      let result = tmpl.render(content.toString(), {
        username: 'DavidCai',
        user: 'myUser',
        lists: [1, 2, 3]
      });
      result.should.containEql('Hello,DavidCai');
      result.should.containEql('has User');
      result.should.containEql('<span>3</span>');
      result.should.containEql('<p>unescaped</p>');
      done();
    });
  });
});
