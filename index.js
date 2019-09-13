const request = require('request');
const AWS = require('aws-sdk');

const url = 'https://www.reddit.com/r/earthporn/.json?limit=1';

let s3 = new AWS.S3();
const bucketName = 'vixayt.com/img';
const fileName = 'background_image.jpg';

exports.handler = function(event, context) {
  let image = '';

  console.log('Making reddit call');
  request(url, function(err, res, body) {
    obj = JSON.parse(JSON.stringify(res));
    jsonData = JSON.parse(obj.body);
    image = JSON.parse(JSON.stringify(jsonData.data.children[0].data.url));
    console.log(image);
    put_from_url(image, bucketName, fileName, function(err, res) {
      console.log(image + ' uploaded successfully');
    });
  });
};
function put_from_url(url, bucket, key, callback) {
  request(
    {
      url: url,
      encoding: null
    },
    function(err, res, body) {
      if (err) return callback(err, res);
      console.log(bucket, key);
      s3.putObject(
        {
          Bucket: bucket,
          Key: key,
          ContentType: res.headers['content-type'],
          ContentLength: res.headers['content-length'],
          Body: body
        },
        callback
      );
    }
  );
}
