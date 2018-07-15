// Test for lib/cli.js
const { spawn } = require('child_process');

describe('Test for cli', () => {
  it('Help messages should show when no argument provide', (done) => {
    spawn('seomate').stdout.on('data', (data) => {
      data.toString().should.containEql('Usage: seomate');
      done();
    });
  });

  it('Error messages should show when file path not exist', (done) => {
    spawn('seomate', ['xxx/yyy/xxx']).stderr.on('data', (data) => {
      data.toString().should.containEql('no such file or directory');
      done();
    });
  });

  it('Test test/test.html result', (done) => {
    spawn('seomate', ['test/test.html']).stdout.on('data', (data) => {
      data.toString().should.containEql('[rule: meta keywords] Must have <meta> with attribute "name" whose value is "keywords"\n[rule: a] <a> must have attribute "rel" (at line: 15)\n[rule: a] <a> must have attribute "rel" (at line: 17)\n[rule: img] <img> must have attribute "alt" (at line: 8)\n[rule: img] <img> must have attribute "alt" (at line: 13)\n');
      done();
    });
  });

  it('Test test/test.html result', (done) => {
    spawn('seomate', ['test/test.html', '-c', 'test/config.json']).stdout.on('data', (data) => {
      data.toString().should.containEql('[rule: meta-robots] Must have <meta> with attribute "name" whose value is "robots"\n');
      done();
    });
  });

  it('Test test/test.html result with test/config.json', (done) => {
    spawn('seomate', ['test/test.html', '-c', 'test/config.json']).stdout.on('data', (data) => {
      data.toString().should.containEql('[rule: meta-robots] Must have <meta> with attribute "name" whose value is "robots"\n');
      done();
    });
  });
});
