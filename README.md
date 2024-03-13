# FNFAO Backend Project

## Technologies

    1- Node JS
    2- MongoDB for Database
    3- Mongoose
    4- express
    5- multer

## Project Setup

### 1. Install Necessary Libraries

Run the following command to install all the dependencies listed in your `package.json` file:

```sh
npm install
```

### 2. Create Environment Files

Assuming you have the config folder with the `example.env` file already, create your environment files for development and production by copying the `example.env`:

```sh
cp config/example.env config/dev.env
cp config/example.env config/prod.env
```

Open each file and update the environment variables as required. For instance, `dev.env` might look like this:

```env
MONGODB_URL=mongodb://localhost:27017/fnf
JWT_SECRET=aSimpleDevSecret
PORT=4000
NODE_ENV=dev
AWS_ACCESS_KEY=yourDevAccessKey
AWS_SECRET_KEY=yourDevSecretKey
AWS_REGION=ca-central-1
```

Your prod.env will have the production settings.

### 3. Database Connection

```javascript
const mongoose = require("mongoose");

const { logger } = require("../utils/logger/loggerUtils");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to database");
  })
  .catch((error) => {
    logger.error("Failed to connect to database!!!", error);
  });
```

With this setup, you should be able to start your application in different environments using the commands `npm run dev`, `npm run prod`, and `npm run start`.

## Commands

### To run the project

- You can run the project by nodemon (only development)
  ```
  npm run dev
  ```
- or run it in the production environment
  ```
  npm run start
  ```
