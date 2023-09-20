import type { AWS } from '@serverless/typescript';

import authentication from '@lambdas/authentication';

const serverlessConfiguration: AWS = {
  service: 'nome_projeto',
  frameworkVersion: '3',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: ['serverless-esbuild', 'serverless-offline'],
  package: {
    individually: true
  },
  provider: {
    name: 'aws',
    region: 'sa-east-1',
    runtime: 'nodejs18.x',
    memorySize: 450,
    timeout: 30,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      PRODUCTION: 'prod',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      JWT_SECURITY: 'GVAUIjI&pM5qJ@u$QqjqF123'
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { authentication }
};

module.exports = serverlessConfiguration;
