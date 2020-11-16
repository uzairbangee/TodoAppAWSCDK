const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

type Params = {
    TableName: string | undefined,
    Key: string | {},
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    UpdateExpression: string,
    ReturnValues: string
  }

export default async (todo:any) => {
    let params: Params = {
        TableName: process.env.TODO_TABLE,
        Key: {
            id: todo.id
        },
        UpdateExpression: "",
        ExpressionAttributeValues: {},
        ExpressionAttributeNames : {},
        ReturnValues: "UPDATED_NEW"
    }

    let prefix = "set ";
    let attributes : string[] = Object.keys(todo);
    for (let i=0; i<attributes.length; i++) {
        let attribute : string = attributes[i];
        if (attribute !== "id") {
        params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
        params["ExpressionAttributeValues"][":" + attribute] = todo[attribute];
        params["ExpressionAttributeNames"]["#" + attribute] = attribute;
        prefix = ", ";
        }
    }

    console.log('params: ', params)
    try {
        await client.update(params).promise()
        return todo
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }

}
