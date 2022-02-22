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
   language: lang,
   description?: string,
   instructions: string,
   donations?: string
}

interface Ingredient {
  name: string;
  amount: string;
}

enum lang {
    EN = 0
};
```
- Adds new recipe to the database

### /recipies/remove/<id>
- type: DELETE
- requires valid 'userToken'(JWT type) for the owner of the recipe and a string(<id>)
- removes recipe from the database

## /user:

### /user/view
- requires valid 'userToken'(JWT type)
- returns a JSON upon success: 
```
{
  username: string,
  email: string,
  Array<recipies>
}
```

### /user/login
- requires a JSON:
```
{
  username: string,
  password: string
}
```
- creates JWT token('userToken') upon success

### /user/register
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
- sets 'userToken'(JWT type) to `null`
