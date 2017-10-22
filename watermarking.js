var fs = require('fs')
, gm = require('gm');

var readStream = fs.createReadStream('./test.jpg');
gm(readStream, 'test.jpg')
.write('reformat.png', function (err) {
  if (!err) console.log('done');
});