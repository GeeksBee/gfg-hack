const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');

/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });

  return readableInstanceStream;
}

var base64ToBuffer = function (base64) {
  var byteString = new Buffer(base64, 'base64').toString('binary');

  var ab = new Buffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return ab;
};

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadFileUsingBase64(string) {
  try {
    var buf = Buffer.from(
      string.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    var data = {
      Bucket: bucketName,
      Key: uuidv4() + '.jpeg',
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };

    return s3.upload(data).promise();
  } catch (err) {
    console.log(err);
    return false;
  }
}
exports.uploadFileUsingBase64 = uploadFileUsingBase64;

// uploads a file to s3
function uploadFile(file) {
  try {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (err) {
    console.log(err);
    return false;
  }
}
exports.uploadFile = uploadFile;

function getHeaders(fileKey) {
  try {
    const params = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return s3.headObject(params).promise();
  } catch (err) {
    console.log(err);
    return null;
  }
}
exports.getHeaders = getHeaders;

// downloads a file from s3
function getFileStream(fileKey) {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
  } catch (err) {
    console.log(err);
    return null;
  }
}
exports.getFileStream = getFileStream;
