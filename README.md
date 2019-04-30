# Tiger Teams

[![Build Status](https://travis-ci.com/ughe/cos333.svg?branch=master)](https://travis-ci.com/ughe/cos333) [Heroku](https://dashboard.heroku.com/apps/tigerteams)

## Local

```
npm install -g yarn
yarn
yarn start
```

## `~/.bashrc`
The following `~/.bashrc` or `~/.bash_profile` is needed for development. For the production server equivalent vars are set on Heroku.
``` bash
export DEBUG_TRUE=true
export AWS_RDS_DATABASE=''
export AWS_RDS_USERNAME=''
export AWS_RDS_PASSWORD=''
export AWS_RDS_HOST=''
```
