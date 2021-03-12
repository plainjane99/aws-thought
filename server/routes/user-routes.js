const express = require('express');
const router = express.Router();

// import aws 'software development kit'
const AWS = require("aws-sdk");

// modify the AWS config object that DynamoDB will use to connect to the local instance
// config points to local instance,
// updates local environmental variables
const awsConfig = {
  region: "us-east-2",
  endpoint: "http://localhost:8000",

};
AWS.config.update(awsConfig);

// create the DynamoDB service object
// note we're using the DynamoDB.DocumentClient() class to create a service interface object, dynamodb
const dynamodb = new AWS.DynamoDB.DocumentClient();
// set table value to 'thoughts'
const table = "Thoughts";

// get all users' thoughts
router.get('/users', (req, res) => {
  const params = {
    // TableName property is assigned 'Thoughts' through the constant
    TableName: table
  };
  // pass the params object into the DynamoDB call
  // use the scan method to return all items of the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // include status code in case an error occurred
    } else {
      // data in the table is in the Items property of the response
      res.json(data.Items)
    }
  });
})

// get thoughts from a user
// use query parameters to pass the username from the client to the server
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  // declare params to define the query call to DynamoDB
  const params = {
    TableName: table,
    // this code provides a condition to the query aka this is the search criteria (similar to where in SQL)
    // in this case, we are only interested in a single user so we condition with the query parameter
    // that we assigned ':user'
    // use aliases 
    // we use the = operator to specify all items that pertain to a single username
    KeyConditionExpression: "#un = :user",
    // define aliases to represent attribute name
    // DynamoDB suggests using aliases as a best practice to avoid a list of reserved words
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought"
    },
    // define aliases to represent attribute value
    // assign the client data to ':user' to use in condition above
    ExpressionAttributeValues: {
      ":user": req.params.username
    },
    // determines which attributes or columns will be returned
    // similar to the SELECT statement in SQL
    // in this case we only want createdAt and the thought itself
    ProjectionExpression: "#th, #ca",
    // default is true which sorts in ascending order
    // we want descending order so we set to false
    ScanIndexForward: false
  };

  // make the database call
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items)
    }
  });
});

// Create new thought
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      "username": req.body.username,
      "createdAt": Date.now(),
      "thought": req.body.thought
    }
  };
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Added item:", JSON.stringify(data));
      res.json({ "Added": JSON.stringify(data, null, 2) });
    }
  });
});
// // Create new user
// router.get('/create', (req, res) => {
//   const params = {
//     TableName: table,
//     Item: {
//       "username": "Carol Dweck",
//       "createdAt": 1602018401105,
//       "thought": "You can suffer the pain of change or suffer remaining the way you are."
//     }
//   };
//   // const params = {
//   //   TableName: table,
//   //   Item: {
//   //     "username": req.body.username,
//   //     "createdAt": Date.now(),
//   //     "thought": req.body.text
//   //   }
//   // };
//   dynamodb.put(params, (err, data) => {
//     if (err) {
//       console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//       console.log("Added item:", JSON.stringify(data, null, 2));
//     }
//   });
// });

// Destroy
router.delete('/users/:time/:username', (req, res) => {

  const username = "Ray Davis"
  const time = 1602466687289;
  const thought = "Tolerance only for those who agree with you is no tolerance at all.";

  const params = {
    TableName: table,
    Key: {
      "username": username,
      "createdAt": time,
    },
    KeyConditionExpression: "#ca = :time",
    ExpressionAttributeNames: {
      "#ca": "createdAt"
    },
    ExpressionAttributeValues: {
      ":time": time,
    }
  }

  console.log("Attempting a conditional delete...");
  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
});

// // update
// router.put('/users/:username', (req, res) => {
//   res.json({ "which": "which" })
// });
  // const { time, username } = req.params;

//   var table = "Movies";

// var year = 2015;
// var title = "The Big New Movie";

// var params = {
//     TableName:table,
//     Key:{
//         "year": year,
//         "title": title
//     },
//     ConditionExpression:"info.rating <= :val",
//     ExpressionAttributeValues: {
//         ":val": 5.0
//     }
// };

// expose the endpoints
module.exports = router;