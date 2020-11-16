const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

export default async (id: String) => {
    console.log(id);
    const params = {
        TableName: process.env.TODO_TABLE,
        Key: {id: id}
    }
    try{
        const data = await client.get(params).promise();
        return data.Item;
    }
    catch(err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}
