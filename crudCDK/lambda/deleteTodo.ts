const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
import Todo from "./type";

export default async (id:string) => {
    console.log(id);
    const params = {
        TableName: process.env.TODO_TABLE,
        Key: {
            id: id
        }
    }
    try{
        await client.delete(params).promise();
        return id;
    }
    catch(err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}
