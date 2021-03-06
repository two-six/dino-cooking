# API Documentation(not finished, some things may change)

## /recipies:

### /recipies/view
- type: GET
- returns: All recipies(JSON type) in an array

### /recipies/add
- type: POST
- requires valid 'userToken'(JWT type) and a JSON:
```
{
   author?: string,
   title: string,
   expected_time?: string,
   ingredients: Array<Ingredient>,
   language: string,
   description?: string,
   instructions: string,
   donations?: string
}

interface Ingredient {
  name: string;
  amount: string;
}
```
- Valid languages: `EN`
- Adds new recipe to the database

### /recipies/remove/`id`
- type: DELETE
- requires valid 'userToken'(JWT type) for the owner of the recipe
- removes recipe and it's children(comments, ratings) from the database

### /recipies/edit/`id`
- type: PUT
- requires valid 'userToken'(JWT type) for the owner of the recipe and a JSON
- throws an error when trying to edit `author`, `id` or `language`
- updates recipe with the values provided in JSON

### /recipies/rate/`id`
- type: PUT
- requires valid 'userToken'(JWT type)
- toggles rate on recipe

## /user:

### /user/view
- type: GET
- requires valid 'userToken'(JWT type)
- returns a JSON upon success: 
```
{
  _id: Bson.ObjectId;
  username: string,
  email: string,
  Array<recipies>
}
```

### /user/login
type: POST
- requires a JSON:
```
{
  username: string,
  password: string
}
```
- creates JWT token('userToken') upon success

### /user/register
- type: POST
- requires a JSON:
```
{
  username: string,
  password: string,
  email: string
}
```
- adds new user to the database upon success

### /user/logout
- type: DELETE
- sets 'userToken'(JWT type) to `null`

### /user/remove/`id`
- type: DELETE
- requires valid 'userToken'(JWT type)
- removes user with the specified `id` and it's children(comments, ratings, recipies) from the database

## /comment

### /comment/view/`id`
- type: GET
- returns all accepted comments of recipe with given `id`

### /comment/add/`id`
- type: POST
- requires valid 'userToken'(JWT type) and a JSON:
```
{
  content: string;
}
```
- adds new comment to the recipe of the specified `id`
### /comment/remove/`id`
- type: DELETE
- requires valid 'userToken'(JWT type)
- removes a comment with the specified `id`

### /comment/edit/`id`
- type: PUT
- requires valid 'userToken'(JWT type) and a JSON:
```
{
  content: string;
}
```
- edits content of the comment with the specified `id`

## /mod

### /mod/makemod/`id`
- type: PUT
- requires a valid 'userToken'(JWT type) for an admin.
- changes user's with given `id` role to `moderator`

### /mod/removemod/`id`
- type: DELETE
- requires a valid 'userToken'(JWT type) for an admin.
- changes user's with given `id` role to `user`

### /mod/viewrec
- type: GET
- requires a valid 'userToken'(JWT type) for an admin or a moderator.
- returns a list of all unaccepted recipies

### /mod/viewcom
- type: GET
- requires a valid 'userToken'(JWT type) for an admin or a moderator.
- returns a list of all unaccepted comments

### /mod/viewmod/
- type: GET
- returns an array of current moderators and admins

### /mod/comaccept/`id`
- type: POST
- requres a valid 'userToken'(JWT type) for an admin or a moderator.
- accepts comment with a given `id`

### /mod/recaccept/`id`
- type: POST
- requires a valid 'userToken'(JWT type) for an admin or a moderator.
- accepts recipe with given `id` and inserts a header of it to the database.

### /mod/comdecline/`id`
- type: DELETE
- requires a valid 'userToken'(JWT type) for an admin or a moderator.
- removes a comment if it's unaccepted.

### /mod/recdecline/`id`
- type: DELETE
- requires a valid 'userToken'(JWT type) for an admin or a moderator.
- removes a recipe if it's unaccepted.