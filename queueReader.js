'use strict';
var AWS = require("aws-sdk");
var sqs = new AWS.SQS();
module.exports.main = (event, context, callback) => {
    event.Records.forEach(record => {
        const { body } = record;
        console.log(body);
      });
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully invoked ${context.functionName}`,
        })
      });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
