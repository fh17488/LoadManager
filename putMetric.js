'use strict';
var AWS = require("aws-sdk");
var cloudwatch = new AWS.CloudWatch();
module.exports.main = (event, context, callback) => {
  const start = Date.now();
  const values = [0, 0, 0, 0, 108, 216, 324, 432, 540, 650, 650, 650, 650, 650, 650, 650, 540, 432, 324, 216, 108, 0, 0, 0, 0];
  let i = 0;
  let timerId = setInterval(() => {
    console.log(values[i]);
    publishValue(values[i]);
    const stop = Date.now()
    console.log(`Time Taken = ${(stop - start)/1000} seconds`);
    i++;
    
  }, 29000);
  setTimeout(() => { clearInterval(timerId); alert('stop'); }, 720000);
  callback(null, 200);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function publishValue(value){
  var params = {
    MetricData: [ /* required */
      {
        MetricName: 'ICS_Mainframe_load', /* required */
        Timestamp: new Date(),
        Value: value,
      },
    ],
    Namespace: 'ICS' /* required */
  };
  cloudwatch.putMetricData(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}
