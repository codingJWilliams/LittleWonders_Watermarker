var fs = require('fs')
  , gm = require('gm');
var resolve = require('path').resolve;
const ProgressPromise = require('progress-promise');

function watermark(file, output) {
  return new Promise( function (resolve, reject) {
    gm(file)
    .size( (err, v) => {
      var isize = v;
      console.log(isize)
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
function batchWatermark(filesInFolder, filesOutFolder) {
  var filesInFolder = resolve(filesInFolder);
  var filesOutFolder = resolve(filesOutFolder);
  return new Promise((resolve, reject) => {
    fs.readdir(filesInFolder, (err, files) => {
      // Files is now a list of all baby photos
      var thePromised = [];
      for ( var i = 0; i < files.length; i++ ) {
        var file = files[i];
        var inPath = require("path").join(filesInFolder, file);
        var outPath = require("path").join(filesInFolder, "..", "out", i.toString() + ".jpg");
        console.log(inPath, outPath);
        thePromised.push(watermark(inPath, outPath));
      }
      Promise.all(thePromised).then( (res) => {
        console.log("Dun")
      })
    })
  })
}
batchWatermark("./in", "./in")
