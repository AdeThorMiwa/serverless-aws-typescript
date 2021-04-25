import type { AWS } from '@serverless/typescript';
import functions from '@functions/index';
import Resources from '@resources/index';

const serverlessConfiguration: AWS = {
  service: 'my-service',
  frameworkVersion: '2',
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    my_table:
      '${self:service}-my-table-${opt:stage, self:provider.stage}',
    table_throughputs: {
      prod: 5,
      default: 1
    },
    table_throughput:
      '${self:custom.table_throughputs.${self:custom.stage},' +
      'self:custom.table_throughputs.default}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      }
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ['env']
      }
    }
  },
  plugins: [
    'serverless-bundle',
    'serverless-dynamodb-local',
    'serverless-offline',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      MY_TABLE: '${self:custom.my_table}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: [
              { 'Fn::GetAtt': ['MyTable', 'Arn'] }
            ]
          }
        ]
      }
    },
    lambdaHashingVersion: '20201221'
  },
  package: {
    individually: true
  },
  // import the function via paths
  functions,
  resources: {
    Resources
  },
  useDotenv: true
};

module.exports = serverlessConfiguration;
