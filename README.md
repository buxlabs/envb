
# envb
> Ensure that you have environment variables set and get/fetch them.

## Description
envb is a library that allows to safety use environment variables. It provides simple API, which enables access to variables in functional style, and it is free from external dependencies.

## Getting Started
```bash
$ npm install envb
```
Create  **.env** and **.env.example** files in the root directory of your project.
The **.env** file should contain variables which will be added to the **process.env**.

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

After then, load the environment variables, using **load** method.
If you created **.env** and **.env.example** files in other destination than root directory, pass to the load method, object with **location** property with path to folder containing required files.
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
const user = env.get('DB_USER') // If variable does not exist returns undefined
```

## License
MIT
