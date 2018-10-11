
# envb
> Ensure that you have environment variables set and get/fetch them.

## Description
envb is a library that allows you to safely use environment variables. It provides a simple API, which enables access to variables in functional style. It is free from external dependencies.

## Getting Started
```bash
$ npm install envb
```
Create  **.env** and **.env.example** files in the root directory of your project.
The **.env** file should contain variables which ou want to use.

> .env
```
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```
>
> .env.example

```
DB_HOST=
DB_USER=
DB_PASS=
```
---
If you created the **.env** and **.env.example** files in other destination than root directory, you can pass a config object to the load method. The configuration should contain a **location** property with a path to the directory containing required files.
```
const env = require('envb')
env.load()
```

```
const env = require('envb')
env.load({ options: 'path/to/folder' })
```
---
Now you can fetch or get the variables, that you need.
```
const host = env.fetch('DB_HOST') // Fetch throws error if the variable is not defined
const user = env.get('DB_USER') // If the variable does not exist it returns undefined
```

## License
MIT
