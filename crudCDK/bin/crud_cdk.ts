#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CrudCdkStack } from '../lib/crud_cdk-stack';

const app = new cdk.App();
new CrudCdkStack(app, 'CrudCdkStack');
