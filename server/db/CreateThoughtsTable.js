// import aws 'software development kit'
const AWS = require("aws-sdk");

// modify the AWS config object that DynamoDB will use to connect to the local instance
// config points to local instance,
// updates local environmental variables
AWS.config.update({
    region: "us-east-2",
    // This is for development only.  
    // comment out when deploying to AWS.  dynamodb service object will point to the web service and not the local instance
    //   endpoint: "http://localhost:8000"
});

// create the DynamoDB service object
// specify the API version to ensure that the API library we're using is compatible
// note we're using the DynamoDB class to create a service interface object, dynamodb
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// create a params object that will hold the schema and metadata of the table
// we use an object-based key-pair definition
// the keys indicate properties, the values indicate the schema configurations
// just like NoSQL, we do not need to pre-define all schema
// here, we will only define the mandatory attributes, which is the partition key or composite key
const params = {
    // designate the table name as Thoughts
    TableName : "Thoughts",
    // KeySchema property, which is where we define the partition key and the sort key
    // DynamoDB uses partition keys to use an attribute with a high degree of uniqueness, similar to primary key in SQL
    // but it isn't mandatory
    // DynamoDB also uses a sort key to create a composite key that provides uniqueness
    KeySchema: [       
        // hash key is named 'username'
        { AttributeName: "username", KeyType: "HASH"},  // Partition key
        // range key is name 'createdAt'
        // benefit of using 'createdAt' as a sort key is that queries automatically sort by value
        { AttributeName: "createdAt", KeyType: "RANGE" }  // Sort key
    ],
    // AttributeDefinitions property defines the attributes (data type) we've used for the hash and range keys
    AttributeDefinitions: [       
        // we assign a string, 'S' to 'username'
        { AttributeName: "username", AttributeType: "S" },
        // we assign a number, 'N' to 'createdAt'
        { AttributeName: "createdAt", AttributeType: "N" }
    ],
    // ProvisionedThroughput property reserves a maximum write and read capacity of the database, which is how AWS factors in pricing
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

// make a call to the dynamoDB instance to create the table
// create table method using schema params
// use createTable method on the dynamodb service object
// pass in the params object and use a callback function to capture the error and response
dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});