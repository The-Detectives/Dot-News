# Software Requirements

## Vision

The journalism community boldly innovates to better engage and inform the public.

We believe that the internet is the most powerful communications medium to arise since the dawn of television. As digital delivery systems become the primary source of news for a growing segment of the world’s population, it presents complex challenges and opportunities for journalists as well as the news audience.

## Scope (In/Out)

### Scope In

#### Features #1: Get latest and top news stories

- The news will be gotten from New York Time journalist website, in addition from our own database.
- The news will be from different categories and well organized in the home page.

#### Features #2: Get top news stories in specific category

- The user can choose a specific category to read a news from.
- The news will be from different sorced (New York Time journalist website and our database).

#### Features #3: Get a specific news article details

- The can click on any news article he interested in and he will be directed to a new page where can read the details of the article.
- A related news will be shown in same page to enhance the user experience.

#### Features #5: Admin dashboard

- A full content management system for the admin to add/edit or delete articles that will be shown to the users in various pages of the website.
- The admin can get access to the dashboard after entering a username and password.

### Scope out

- The application will not save data from the API to the database because it's refreshable information that has to be updated frequently.

### Minimum Viable Product vs

The application get and show news articles from various sources (for news website api and our database) and a full CSM for admins to manage the website.

### Stretch

- Improve the admin CMS and including statistics about each article.
- Including more news APIs to the app and display news based on users locations.
- Including weather news to the app.
- Search news by keyword.

## Functional Requirements

1. Admin can create, edit and delete news articles.
2. User can filter news by category.
3. User can leave us a message with the contact us form.

### Data Flow

- The user open the home page where various news articles will be shown in an organized way from New York Time website and our database and grouped by categories
- The use can click on any article to read.
- If the article from New York Time website he will be redirected to the article page on their website.
- If the article from our database, the user will be redirected to a new page to show the details of the article.
- Related news articles will be shown at the article details page to get the attention of the user and improve the user experience.
- The user can navigate to the about us page where her can read about the websites team and can leave a message.
- The admin can navigate to the login page where he enters the username and the password to get access to the dashboard.
- After getting access to the dashboard, the articles in the database will be shown so that the admin can delete and edit or even add new articles when he click on the appropper button.
- When the admin click on add new article, he will be navigated to a new page with a text editor where he can add the content and save it.
- When the admin click on edit an article button he will be navigated to a new page with a text editor filled with last content so he can update it and save.
- When the admin click on delete an article button the article will be deleted from the database.
- All changes will be directly reflected on all website pages.

## Non-Functional Requirements

### Security

- No one can get access to the admin dashboard and perform any process if he is not the admin and logged in successfully.
- The password will be hashed in database and a different token will be generated on each login.
- The token will be verified on each request.
