'use strict';
var AWS = require("aws-sdk");
var cloudwatch = new AWS.CloudWatch();
var lambda = new AWS.Lambda();
module.exports.main = (event, context, callback) => {
    const MS_PER_MINUTE = 60000;
    const durationInMinutes = 1;
    const endTime = new Date()
    const startTime = new Date(endTime - (durationInMinutes*MS_PER_MINUTE));
    var params = {
        "MetricDataQueries": [{
            "Id": "myRequest",
            "MetricStat": {
                "Metric": {
                    "Namespace": "ICS",
                    "MetricName": "ICS_Mainframe_load"
                },
                "Period": 60,
                "Stat": "Average"
            },
            "ReturnData": true
        }],
        "StartTime": startTime,
        "EndTime": endTime
    };
      cloudwatch.getMetricData(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
            let metricValue = data.MetricDataResults[0].Values[0];
            const concurrencyLimitOfRegularPriorityQueueReader = ((650-metricValue)/43.32);
            const concurrencyLimitOfHighPriorityQueueReader = 3 * concurrencyLimitOfRegularPriorityQueueReader;
            var params = {
                FunctionName: "loadmanager-dev-regularPriorityQueueReader", 
                ReservedConcurrentExecutions: concurrencyLimitOfRegularPriorityQueueReader
               };
               lambda.putFunctionConcurrency(params, function(err, data) {
                 if (err) console.log(err, err.stack); // an error occurred
                 else     console.log(data);           // successful response
               });
               var params = {
                FunctionName: "loadmanager-dev-highPriorityQueueReader", 
                ReservedConcurrentExecutions: concurrencyLimitOfHighPriorityQueueReader
               };
               lambda.putFunctionConcurrency(params, function(err, data) {
                 if (err) console.log(err, err.stack); // an error occurred
                 else     console.log(data);           // successful response
               });
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                  //message: `Sucessfully invoked ${context.functionName}`,
                  message: `Metric Value ${data.MetricDataResults[0].Values[0]}`
                })
              });
            console.log(data.MetricDataResults[0].Values[0])
        }    
      });
    
};