var fs = require('fs')
  , gm = require('gm');
var resolve = require('path').resolve;

function watermark(file, output) {
  return new Promise( function (resolve, reject) {
    gm(file)
    .size( (err, v) => {
      var isize = v;
      gm(file)
      .fontSize( Math.round(isize.height / 12) )
      .font("Consolas")
      .fill("#7caeff")
      .drawText(0, isize.height / 2, "PROOF ".repeat(30))
      .resize(isize.width / 4, isize.height / 4)
      .write(output, (err) => {
        if (!err) {
          resolve()
        } else {
          reject(err)
        }
      })
    });
  })  
}
function batchWatermark(filesInFolder) {
  var filesInFolder = resolve(filesInFolder);
  var path = require("path");
  var wrPath = path.join(filesInFolder, "..", "web ready");
  var readyExists = fs.existsSync(wrPath);
  if (readyExists == false) {
    fs.mkdirSync(wrPath);
  }

  return new Promise((resolve, reject) => {
    fs.readdir(filesInFolder, (err, files) => {
      // Files is now a list of all baby photos
      var thePromised = [];
      for ( var i = 0; i < files.length; i++ ) {
        var file = files[i];
        var inPath = path.join(filesInFolder, file);
        var outPath = path.join(filesInFolder, "..", "web ready", i.toString() + ".jpg");
        console.log(inPath, outPath);
        thePromised.push(watermark(inPath, outPath));
      }
      Promise.all(thePromised).then( (res) => {
        resolve()
      })
    })
  })
}
exports.batch = batchWatermark;
exports.single = watermark;
