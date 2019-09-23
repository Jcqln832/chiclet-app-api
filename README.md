## Introduction

Chiclet allows users to plan and keep track of their year by month. A user can add items such as special events, goal deadlines, or focus themes to the months and the app provides a view of the entire year. Alternatively, the app can be used as an accomplishment record keeper rather than a planner of future milestones. Users can add new items, delete items, and edit items. 

This app is a capstone project for Thinkful's full stack JavaScript program. 

## Build

Chiclet's front end is built with React. The back end is built with Express, and PostgreSQL for the databse. The database and server and hosted with Heroku.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Live Link: https://www.chiclet.now.sh

## Images

![Chiclet Landing Page](https://user-images.githubusercontent.com/12238742/65449972-226b3000-de0a-11e9-9400-0d3e678bae2e.png)
***
![Chiclet Months Page](https://user-images.githubusercontent.com/12238742/65450019-3c0c7780-de0a-11e9-8826-1fc02f5f9906.png)
***
![Chiclet Single Month Page](https://user-images.githubusercontent.com/12238742/65450046-49296680-de0a-11e9-9d84-6d7db5d33b19.png)
***
![Chiclet Edit Item Page](https://user-images.githubusercontent.com/12238742/65450070-534b6500-de0a-11e9-9937-7931df2753f7.png)

## Security
User passwords are hashed using bcrypt.js. Logged in users are provided a JWT for protected requests.

## API Documentation
API endpoints include:

- POST to '/users' to create a new user
- POST to '/auth/login' to sign in an existing user
- GET to '/items' to access all of a user's calendar items
- POST to '/items' to add a new item to the user's calendar
- PATCH to '/items/:itemId' to update an existing item
- DELETE to '/items/:itemId' to delete a item

## Future Development
Additional features and improvements would include:

- Options page with a form for resetting your password or deleting your account
- Ability to attach photos, files, and dates to items
- Alternate view of the single month page