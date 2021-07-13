'use strict';
var AWS = require("aws-sdk");
var sqs = new AWS.SQS();
module.exports.main = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const message = requestBody.message;
    const queueType = requestBody.priority;
    forwardMessageToQueue(message, queueType);
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted message ${message} with priority ${queueType}`,
        })
      });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function forwardMessageToQueue(message, queueType){
    let queueURL = "";
    var params = {
        QueueNamePrefix: queueType
      };
      sqs.listQueues(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{     
            console.log(data);           // successful response
            queueURL = data.QueueUrls[0];
            console.log("queueurl", queueURL);
            var params = {
                MessageBody: message, /* required */
                QueueUrl: queueURL, /* required */
              };
              sqs.sendMessage(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });
        }
      });
}