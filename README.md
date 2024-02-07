# **Blog API Application Project**

## Tech Stack

**Server:** Node, Express, MongoDB, Mongoose, JWT

# API FEATURES

- Authentication & Authorization
- Post CRUD operations
- User CRUD operations
- Comment CRUD operations
- Category CRUD operations
- like and dislike a comment
- Admin can suspend a user
- A user can block different users
- A user who block another user cannot see his/her posts
- blocked user cannot see the profile of the user who blocked him/her
- blocked user cannot follow the user who blocked him/her
- blocked user cannot like, dislike or comment the post of the user who blocked him/her
- A user can like and dislike a post
- total likes and dislikes count
- Changing user award base on number of posts created by the user
- A user can follow and unfollow another user
- Get following and followers count
- Get posts of following users
- A user can view another user's profile
- Get total profile viewers count
- Get posts created count
- Get blocked counts
- Get all users who views someone's profile
- Admin can unsuspend a suspended user
- Update password
- Profile photo uploaded
- A user can close his/her account

# ENDPOINTS

- [**Blog API Application Project**](#blog-api-application-project)
  - [Tech Stack](#tech-stack)
- [API FEATURES](#api-features)
- [ENDPOINTS](#endpoints)
  - [Run Locally](#run-locally)
  - [Environment Variables](#environment-variables)
- [API Authentication](#api-authentication)
  - [Register a new API client](#register-a-new-api-client)
- [**API Reference**](#api-reference)
  - [**User Login**](#user-login)
  - [**get my profile**](#get-my-profile)
  - [**Get all users**](#get-all-users)
  - [**view a user profile**](#view-a-user-profile)
      - [**Following a user**](#following-a-user)
  - [**UnFollowing a user**](#unfollowing-a-user)
  - [**Update user password**](#update-user-password)
  - [**Update your profile**](#update-your-profile)
  - [**Block another user**](#block-another-user)
  - [**Unblock user**](#unblock-user)
  - [**Admin blocking a user**](#admin-blocking-a-user)
  - [**Admin unblocking a user**](#admin-unblocking-a-user)
  - [**Delete your account**](#delete-your-account)
  - [**Upload Profile Photo**](#upload-profile-photo)
- [**Posts API Refeference**](#posts-api-refeference)
  - [**Create Post**](#create-post)
  - [**Get the feed**](#get-the-feed)
  - [**Get posts of followings**](#get-posts-of-followings)
  - [**Like Post**](#like-post)
  - [**Dislike Post**](#dislike-post)
  - [**Update Post**](#update-post)
  - [**Delete Post**](#delete-post)
- [**Comment API Reference**](#comment-api-reference)
  - [**Create Comment**](#create-comment)
  - [**Delete Comment**](#delete-comment)
  - [**Update Comment**](#update-comment)

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run server
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URL`
`JWT_SECRET`
`JWT_EXPIRE`
`JWT_COOKIE_EXPIRES_IN`



# API Authentication

Some endpoints may require authentication for example. To create a create/delete/update post, you need to register your API client and obtain an access token.

The endpoints that require authentication expect a bearer token sent in the `Authorization header`.

**Example**:

`Authorization: Bearer YOUR TOKEN`

## Register a new API client

```http
POST /api/v1/users/register
```

The request body needs to be in JSON format.

# **API Reference**

## **User Login**

```http
POST /api/v1/users/login
```

| Parameter        | Type     | Description   | Required |
| :--------------- | :------- | :------------ | :------- |
| `authentication` | `string` | Your token    | no       |
| `email`          | `string` | Your email    | yes      |
| `password`       | `string` | Your password | yes      |

Example request body:

```javascript
{
  "email":"your email"
  "password":"your password"
}
```

## **get my profile**

```http
GET /api/v1/users/profile
```

| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | yes      |

## **Get all users**

```http
GET /api/v1/users/users
```

| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | no       |

## **view a user profile**

```http
GET /api/v1/users/view-profile/:id
```

| Parameter        | Type     | Description                                 | Required |
| :--------------- | :------- | :------------------------------------------ | :------- |
| `authentication` | `string` | Your token                                  | yes      |
| `id`             | `string` | ID of the user you want to view his profile | yes      |

#### **Following a user**

```http
POST /api/v1/users/follow-user/:id
```

| Parameter        | Type     | Description                       | Required |
| :--------------- | :------- | :-------------------------------- | :------- |PATCH
| `authentication` | `string` | Your token                        | yes      |
| `id`             | `string` | ID of the user you want to follow | yes      |

## **UnFollowing a user**

```http
POST /api/v1/users/unfollow-user/:id
```

| Parameter        | Type     | Description                       | Required |
| :--------------- | :------- | :-------------------------------- | :------- |
| `authentication` | `string` | Your token                        | yes      |
| `id`             | `string` | ID of the user you want to follow | yes      |

## **Update user password**

```http
PATCH /api/v1/users/update-password
```

| Parameter        | Type     | Description         | Required |
| :--------------- | :------- | :------------------ | :------- |
| `authentication` | `string` | Your token          | yes      |
| `password`       | `string` | Enter your password | yes      |

Example request body:

```javascript
{
  "password":"value"
}
```

## **Update your profile**

```http
PATCH /api/v1/users/update-me
```

| Parameter        | Type     | Description          | Required |
| :--------------- | :------- | :------------------- | :------- |
| `authentication` | `string` | Your token           | yes      |
| `email`          | `string` | Enter your email     | no       |
| `firstname`      | `string` | Enter your firstname | no       |
| `lastname`       | `string` | Enter your lastname  | no       |

Example request body:

```javascript
{
  "email":"value",
  "firstname":"value",
  "lastname":"value",
}
```

## **Block another user**

```http
PATCH /api/v1/users/block-user/:id
```

| Parameter        | Type     | Description                      | Required |
| :--------------- | :------- | :------------------------------- | :------- |
| `authentication` | `string` | Your token                       | yes      |
| `id`             | `string` | Id of the user you want to block | yes      |

## **Unblock user**

```http
PATCH /api/v1/users/unblock-user/:id
```

| Parameter        | Type     | Description                        | Required |
| :--------------- | :------- | :--------------------------------- | :------- |
| `authentication` | `string` | Your token                         | yes      |
| `id`             | `string` | Id of the user you want to unblock | yes      |

## **Admin blocking a user**

```http
PATCH /api/v1/users/suspend-user/:id
```

| Parameter        | Type     | Description                      | Required |
| :--------------- | :------- | :------------------------------- | :------- |
| `authentication` | `string` | Your token                       | yes      |
| `id`             | `string` | Id of the user you want to block | yes      |

## **Admin unblocking a user**

```http
PATCH /api/v1/users/unsuspend-user/:id
```

| Parameter        | Type     | Description                        | Required |
| :--------------- | :------- | :--------------------------------- | :------- |
| `authentication` | `string` | Your token                         | yes      |
| `id`             | `string` | Id of the user you want to unblock | yes      |

## **Delete your account**

```http
  DELETE /api/v1/users/delete-me
```

| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | yes      |

## **Upload Profile Photo**

```http
  POST /api/v1/users/profile-photo-upload
```

| Parameter        | Type     | Description     | Required |
| :--------------- | :------- | :-------------- | :------- |
| `authentication` | `string` | Your token      | yes      |
| `profilePhoto`   | `string` | Image to upload | yes      |

# **Posts API Refeference**

## **Create Post**

```http
  POST /api/v1/posts
```

| Parameter        | Type     | Description        | Required |
| :--------------- | :------- | :----------------- | :------- |
| `authentication` | `string` | Your token         | yes      |
| `title`          | `string` | Post title         | yes      |
| `description`    | `string` | Post description   | yes      |
| `category`       | `string` | Name of the category | no      |
| `photo`          | `string` | Image of the post  | no      |

Example request body:

```javascript
{
  "title":"value",
  "description":"value",
  "category":"value",
  "photo":"photo",
}
```

## **Get the feed**

```http
  GET /api/v1/posts
```

| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | no       |

## **Get posts of followings**

```http
  GET /api/v1/posts/posts-of-following-user
| Parameter        | Type     | Description | Required |
| :--------------- | :------- | :---------- | :------- |
| `authentication` | `string` | Your token  | yes       |


## **Get Single Post**

```http
  GET /api/v1/posts/:id
```

| Parameter        | Type     | Description    | Required |
| :--------------- | :------- | :------------- | :------- |
| `authentication` | `string` | Your token     | yes      |
| `id`             | `string` | ID of the post | yes      |

## **Like Post**

```http
  GET /api/v1/like-post/:id
```

| Parameter        | Type     | Description    | Required |
| :--------------- | :------- | :------------- | :------- |
| `authentication` | `string` | Your token     | yes      |
| `id`             | `string` | ID of the post | yes      |

## **Dislike Post**

```http
  GET /api/v1/posts/dislike-post/:id
```

| Parameter        | Type     | Description    | Required |
| :--------------- | :------- | :------------- | :------- |
| `authentication` | `string` | Your token     | yes      |
| `id`             | `string` | ID of the post | yes      |

## **Update Post**

```http
  PATCH /api/v1/posts/:id
```

| Parameter        | Type     | Description             | Required |
| :--------------- | :------- | :---------------------- | :------- |
| `authentication` | `string` | Your token              | yes      |
| `id`             | `string` | ID of the post          | yes      |
| `title`          | `string` | title of the post       | yes      |
| `description`    | `string` | description of the post | yes      |
| `category`       | `string` | category of the post    | no      |
| `photo`          | `string` | photo of the post       | no      |

Example request body:

```javascript
{
  "title":"value",
  "description":"value",
  "category":"value",
  "photo":"photo",
}
```

## **Delete Post**

```http
  DELETE /api/v1/posts/:id
```

| Parameter        | Type     | Description    | Required |
| :--------------- | :------- | :------------- | :------- |
| `authentication` | `string` | Your token     | yes      |
| `id`             | `string` | ID of the post | yes      |

# **Comment API Reference**

## **Create Comment**

```http
  POST /api/v1/comments
```

| Parameter        | Type     | Description    | Required |
| :--------------- | :------- | :------------- | :------- |
| `authentication` | `string` | Your token     | yes      |
| `id`             | `string` | ID of the post | yes      |

## **Delete Comment**

```http
  DELETE /api/v1/comments/:id
```

| Parameter        | Type     | Description       | Required |
| :--------------- | :------- | :---------------- | :------- |
| `authentication` | `string` | Your token        | yes      |
| `id`             | `string` | ID of the comment | yes      |

## **Update Comment**

```http
  PUT /api/v1/comments/:id
```

| Parameter        | Type     | Description    | Required |
| :--------------- | :------- | :------------- | :------- |
| `authentication` | `string` | Your token     | yes      |
| `id`             | `string` | ID of the post | yes      |
