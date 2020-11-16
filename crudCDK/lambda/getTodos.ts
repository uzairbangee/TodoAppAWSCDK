const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

export default async () => {
    const params = {
        TableName: process.env.TODO_TABLE
    }
    try{
        const data = await client.scan(params).promise();
        return data.Items;
    }
    catch(err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}
