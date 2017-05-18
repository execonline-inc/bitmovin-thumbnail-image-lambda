const createThumb = (message) => {
  const jobId = message.payload.jobId;
  const bitcodin = require('bitcodin')(process.env.BITMOVIN_API_TOKEN);
  const thumbnailConfiguration = {
    "jobId": parseInt(jobId),
    "height": 320,
    "position": 6,
    "filename": "thumb.png",
    "async": true
  };
  console.log('Successfully created a thumbnail');
  return bitcodin.thumbnail.create(thumbnailConfiguration)
}

const getThumb = (result) => {
  const rp = require('request-promise');
  const requestParams = {
    url: result.thumbnailUrl,
    encoding: null,
    resolveWithFullResponse: true
  }
  console.log('Successfully requested thumb')
  return rp(requestParams);
}

const transferThumbToS3 = (res, message) => {
  const AWS = require('aws-sdk');
  const outputUrl = message.payload.outputUrl
  const bucket = process.env.STAGING_VIDEO_BUCKET
  const key = 'bitmovin/' + outputUrl.match(/[0-9]{2,}_[A-z 0-9]+$/)[0] + '/thumb.png';
  const s3 = new AWS.S3({
                  region: 'us-east-1',
                  accessKeyId: process.env.AWS_KEY,
                  secretAccessKey: process.env.AWS_SECRECY_KEY
                        });

  let params = {
    Bucket: bucket,
    Key: key,
    Body: res.body,
    ContentType: res.headers['content-type'],
    ContentLength: res.headers['content-length'],
    ACL: 'public-read'
  }

  const s3Promise = s3.putObject(params).promise();
  return s3Promise
}

class BitmovinThumbnailImageLambda {
  start = (message) => {
    return createThumb(message)
      .then((res) => {
        return getThumb(res);
      })
      .then((res) => {
        return transferThumbToS3(res, message);
      }
    );
  }
}

export default BitmovinThumbnailImageLambda;
