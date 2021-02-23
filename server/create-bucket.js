// we can run node create-bucket.js to run just this file and create a bucket
// go to S3 in AWS Management Console to see the created bucket
// this verifies that aws-sdk could use the credentials we configured with 'aws configure' in the command line
// to communicate with S3
// this also lets us use our keys without exposing them in the code
// ----- see AWS documentation to set up CLI
// ----- https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html

// Load the AWS SDK for Node.js
// This package is responsible for the API that allows the application to communicate with the web service
// use npm install aws-sdk to get this package
const AWS = require('aws-sdk');

// create a unique S3 bucket name
// npm install uuid to get this package
const { v4: uuidv4 } = require('uuid');

// configure the region
// Set the region to what we input into the 'aws configure' in the command line
AWS.config.update({ region: 'us-east-2' });

// Create S3 service object
// creates the s3 instance object with the designated API
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// create the bucketParams object that assigns the metadata of the bucket (such as the bucket name)
// Create the parameters for calling createBucket
var bucketParams = {
    Bucket: "user-images-" + uuidv4()
};

// call the s3 instance object to create an S3 bucket using the bucketParams
// used a callback function with the createBucket method and the bucketParams object to create an S3 bucket
// call S3 to create the bucket
s3.createBucket(bucketParams, (err, data) => {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success");
    }
});