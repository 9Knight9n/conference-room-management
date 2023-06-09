# conference-room-management
a conference room management system 

## Description

Backend development is the main focus in this project, so there is almost no field validation in Frontend. all fields are heavily check in backend using relevant serializers and in case of any error notifications will be shown expressing the problem.

## Getting Started

### Dependencies

* docker version 20.10 or higher (lower might also work)
* docker compose version 2.15 or higher (lower might also work)
<br/>
<br/>
I strongly suggest to use docker as it would make things like superuser creation, migrations, database and many more automated. The whole setup process would take less than a minute if required files are already downloaded.

### Running

* Clone project
```
git clone https://github.com/9Knight9n/conference-room-management.git
```
* Change directory into cloned folder
```
cd conference-room-management
```
* Create .env file from example .env file (use copy instead of cp in linux)
```
cp .env.example .env
```
* Run project with docker compose
```
docker compose up
```
* Visit http://localhost:3000/ to start


## In-depth

### Services
Services used in application
* Django: Back-end framework
* PostgreSQL: Database
* React.js: Front-end framework


### Tasks
- [x] Initialize Django
- [x] Dockerize Django and PostgreSQL
- [x] Added Authentication (django Knox auth)
- [x] Create User Model and with its serializer
- [x] Add auto superuser creator script 
- [x] Add auto Migration script
- [x] Add Permission for each kind of user
- [x] Add Room and Meeting models
- [x] Add serializer and validators for Room and Meeting models
- [x] Add required APIs
- [x] Export created API to a postman export file
- [x] Initialize React.js
- [x] Dockerize React.js
- [x] Add Login and Signup page
- [x] Add Admin panel
- [x] Add Manager panel
- [x] Add Public panel
- [x] Create readme
- [ ] Create Production versions of Dockerfiles