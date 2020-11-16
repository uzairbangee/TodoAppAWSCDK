import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3'
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as path from 'path'

export class CrudCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create API
    const api = new appsync.GraphqlApi(this, "Api", {
      name: 'cdk-todo-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
      xrayEnabled: true
    })

    new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl
    })

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    new cdk.CfnOutput(this, "GraphQLRegion", {
      value: this.region
    });

    const todo_lambda = new lambda.Function(this, "TodoLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'todo.handler',
      code: lambda.Code.fromAsset("lambda")
    })

    const lambda_data_source = api.addLambdaDataSource("LamdaDataSource", todo_lambda);

    lambda_data_source.createResolver({
      typeName: "Query",
      fieldName: "todos"
    })

    lambda_data_source.createResolver({
      typeName: "Query",
      fieldName: "todoByID"
    })

    lambda_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "createTodo"
    })

    lambda_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo"
    })

    lambda_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo"
    })

    const todoTable = new ddb.Table(this, "TodoTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING
      }
    })

    todoTable.grantFullAccess(todo_lambda);

    todo_lambda.addEnvironment('TODO_TABLE', todoTable.tableName);

    const myBucket = new s3.Bucket(this, "GATSBYbucket", {
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,        
        websiteIndexDocument: "index.html"
    });

    const dist = new cloudfront.Distribution(this, 'myDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    });

    new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset("../client/public")],
      destinationBucket: myBucket,
      distribution: dist
  });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: dist.domainName
    });

  }
}
