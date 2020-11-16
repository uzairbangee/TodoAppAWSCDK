const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
import Todo from "./type";

export default async (todo:Todo) => {
    console.log(todo);
    const params = {
        TableName: process.env.TODO_TABLE,
        Item : todo
    }
    console.log(params);
    try{
        await client.put(params).promise();
        return todo;
    }
    catch(err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}
