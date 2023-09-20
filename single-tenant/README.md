### Primeira Execuação local

# Node Modules

- Execute utilizando `npm install` para instalar dependencias;

# Postgres

- Confira crendencias de acesso ao *Postgres* nos locais => **config/config.json** - **config/default-config.json** - **public-schema/config.json**
- Crie o database *gestao_facil* no Postgres;
- Após acessando o diretório **public-schema** do projeto execute o comando `npx sequelize-cli db:migrate`;

# Tenant

- Retornando à raiz do projeto execute o comando `npm run create-tenant`;
- Nome do tenant será da base escolhida para acessar - Exemplo[ranailspa];

# Migration

- Acessando o diretório **store-integration** execute o comando para migrar dados da base escolhida `node ranailspa.js`;

# Exec

- Execute utilizando `npm start`

# PostMan Tests

- [Link](https://drive.google.com/file/d/1wD4PX7sk9UFDyu0b8ZBHci40u26MlIBH/view?usp=sharing)

----------------------------------------------------------------------------------------------------------------------------------------

# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

###

Criar banco de dados e rodar o seguinde script:

-- public."SequelizeMeta" definition

-- Drop table

-- DROP TABLE public."SequelizeMeta";

CREATE TABLE public."SequelizeMeta" (
	"name" varchar(255) NOT NULL,
	CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name)
);


-- public.client definition

-- Drop table

-- DROP TABLE public.client;

CREATE TABLE public.client (
	id uuid NOT NULL,
	"schema" varchar(250) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT client_pkey PRIMARY KEY (id)
);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE gestao_facil."user" (
	id uuid NOT NULL,
	"name" varchar(250) NOT NULL,
	"email" varchar(250) NOT NULL,
	"username" varchar(250) NOT NULL,
	"enable" varchar(250) NOT NULL,
	"type" varchar(250) NOT NULL,
	"accepted_terms" boolean NOT NULL,
	"schema" varchar(250) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"createdBy" timestamptz NOT NULL,
	"updatedBy" timestamptz NOT NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id)
);


-- public.menu definition

-- Drop table

-- DROP TABLE public.menu;

CREATE TABLE public.menu (
	id uuid NOT NULL,
	"name" varchar(250) NOT NULL,
	icon varchar(250) NULL,
	router_link varchar(250) NULL,
	parent_id uuid NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT menu_pkey PRIMARY KEY (id),
	CONSTRAINT menu_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.menu(id)
);


-- public.menu_permissions definition

-- Drop table

-- DROP TABLE public.menu_permissions;

CREATE TABLE public.menu_permissions (
	id uuid NOT NULL,
	menu_id uuid NOT NULL,
	"name" varchar(250) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT menu_permissions_pkey PRIMARY KEY (id),
	CONSTRAINT menu_permissions_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menu(id)
);

###

- Run `npm run create-tenant`

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/hello` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by API Gateway against `src/functions/hello/schema.ts` JSON-Schema definition: it must contain the `name` property.

- requesting any other path than `/hello` with any other method than `POST` will result in API Gateway returning a `403` HTTP error code
- sending a `POST` request to `/hello` with a payload **not** containing a string property named `name` will result in API Gateway returning a `400` HTTP error code
- sending a `POST` request to `/hello` with a payload containing a string property named `name` will result in API Gateway returning a `200` HTTP status code with a message saluting the provided name and the detailed event processed by the lambda

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f hello --path src/functions/hello/mock.json` if you're using NPM
- `yarn sls invoke local -f hello --path src/functions/hello/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`


