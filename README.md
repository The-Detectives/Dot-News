# Project Name: Dot-News

Version: 1.0.0

## Team Members (Authors)

1. Wesam Al-Masri (TL)
2. Wafa'a Ankoush
3. Mohammad Nofal
4. Nour Abu Elenein
5. Tamara Manaseer

## Overview

Full Stack news web application with a content management system for the administration to manage the content of the website.

## Getting Started

1. Fork the repo then clone it using `git clone <your forked repos link>`.
2. Install all the needs packages by npm install.
3. Create a postegres database and get the link to the database.
4. Create a `.env` file to store the virtual environment in the root directory, then add the following variables:
   - `DATABASE_URL = "Link to your database that you have created in step number 4"`
   - `DEV_MODE = true`,  if your are using local database that not support the ssl connection
   - `CATEGORY_KEY = new yourk time api secret key`,
5. Apply sql commands in schema.sql by `psql -f src/data/shema.sql - d <database name>`.
6. Create a super user by running this command to the terminal `node src/createAdminUser`, it will ask you for a username and password.
7. Run the server by entering the command npm start.
8. Now go to the `/admin` routes and enter the username and password to get access to the admin dashboard where you can manage the content.

## File structure

![dot-news uml](assets/dot-news-uml.jpg)

## Architecture

- Lnaguage: JavaScript with Node.js, postgreSQL
- Frameworks and libraries used: express, ejs, cookie-session, cors, express-messages, method-override, multer, dotenv, pg, superagent, bcrypt, connect-flash, crypto
- APIs: The New York Times

![javascrip](https://camo.githubusercontent.com/70af7d849226bbfced08e4510d3b0dc5cc6a38b3415abee253ec233286e5f66f/68747470733a2f2f6c68342e676f6f676c6575736572636f6e74656e742e636f6d2f686b614e467778315039314636425173762d4f56642d432d68344743784c4f67675a3969724f4545576e6a4d69667a53376a717a77666a3650775554614a367955635a304f75655275695a515252587771515775486369775a5a6d686c30634179486766494f792d544146336d33766f623135497142535f765a5955546c615f313337594e657276733341)

![nodejs and express](https://camo.githubusercontent.com/9ade6b7daaddeb7387dd09693e0295b264be4c6e520487cc2ccf37c05c6d6c4a/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f466b3137487533757550455a464841583847486141544b3770796d645851464a4b35733769322d4e62794275464a73455f324f55517432627737672d3269423439657453757874357546533671514b4279364a746f4b35507132694f657567726f77316f5f725536574761315077574b687565304345685f5943574d4249724a7a6c6e6238366972534763)

![ejs](https://miro.medium.com/max/720/1*DG4VA127mu4Fx2TrRIzskw.jpeg)

![postgres](https://camo.githubusercontent.com/f80a0890f0522bd1be4e42725b8b0d2baeea1c59ac3fbefec65d87aef367ad7b/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f5f53452d626b47626d5544483041365643746a3152386652533948575962374f5f5a39537267555f52384841654d52624469734a6968317744583559485053576e31772d5a2d6375794d6a6f6e65546e6c4a6d6e374d7835746d585368423055734c676f6739306f446c31676e39632d31453838706a476734364a3079364345786d494253774d47413951)

## Deployed app link

[Dot-news Website](dot-news.herokuapp.com/)