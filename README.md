# General

$ node -v
v8.10.0
$ npm -v
6.7.0

Your app has two folders back and front/front, It has 2 package.json. You need to install dependencies separately
First of all you need to install
- node.js    I used v8.10.0
- mongoDB    I used MongoDB Server version,db version v3.6.3 and MongoDB shell version v3.6.3
- You can also install compass to check your base work https://www.mongodb.com/download-center/compass?jmp=docs
- Angular CLI (https://github.com/angular/angular-cli) version 7.3.1.

#Backend

1. clone the repository
2. Go into back directory
3. npm install
4. create in root of folder back .env file and enter your existing gmail and  your pass from this email
You need this to test how email confirmation works
example 
USER_NAME = test@gmail.com
PASSWORD = 123456
4.  For correct work check this your Gmail  Let less secure apps access your account
https://support.google.com/accounts/answer/6010255?hl=en

5. I did not remove keys for stripe and paypal, you are free to use them for testing
6. When you will test paypal payment
you will be asked to enter test login and pass

for stripe you can use test card number 4242 4242 4242 4242

7. Also, add tariff plans to the base you can do it wia postmen
http://API_URL/matches/tariff/create

8.  npm run dev

# Frontend

1. Go into front/front
npm install

2. ng serve --open

# Some additional info Front

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
