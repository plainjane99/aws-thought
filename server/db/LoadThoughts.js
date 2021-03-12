// import aws 'software development kit'
const AWS = require("aws-sdk");
const fs = require('fs');

// modify the AWS config object that DynamoDB will use to connect to the local instance
// config points to local instance,
// updates local environmental variables
AWS.config.update({
  region: "us-east-2",
  endpoint: "http://localhost:8000"
});

// create the DynamoDB service object
// module instructions likely wrong:  specify the API version to ensure that the API library we're using is compatible
// note we're using the DynamoDB.DocumentClient() class to create a service interface object, dynamodb
// The DynamoDB.DocumentClient() class differs from the DynamoDB class by enabling us to use JavaScript objects as arguments and return native JS types
// const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

console.log("Importing thoughts into DynamoDB. Please wait.");

// use fs package to read users.json seed file and assign the object to the allUsers constant
// note/reminder:  fs.readFileSync relative path is to the location of where the file is executed and not between files
// i.e. relative to the prject's root directory
const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

// loop over allUsers and create the params object with the elements in the array
allUsers.forEach(user => {
  // for each user, create the params object with the elements in the array
  // each of the array elements go into it's own Item of the Table
  const params = {
    TableName: "Thoughts",
    Item: {
      "username": user.username,
      "createdAt": user.createdAt,
      "thought": user.thought
    }
  };

  // while in the loop, we make a call to the database with the service interface object, dynamodb
  // and add the data to the database
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
  });
});