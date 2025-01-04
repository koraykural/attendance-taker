# Attendance Taker

## Migrations

Typeorm will use .env file. Make sure you are going to connect to the correct DB by checking .env file.

- To generate a new migration:

  - `npm run typeorm -- migration:generate apps/api/src/migrations/NameOfTheMigration`

- To run the migrations:
  - `npm run typeorm -- migration:run`

## Instructions to deploy to ECS

- Setup ECS cluster
- Setup RDS and Elasticache
- Update api_secrets in Secrets Manager
- Change ELB target to ECS
  - Use conditions to redirect to correct service
- Uncomment ECS deployment step in github workflows

## Commands to deploy to EC2

- Change ELB target to EC2
  - You don't need to specify any redirects as there is an Nginx server handling routing.
- Comment out ECS deployment step in github workflows
- Connect to EC2 instance via ssh
  - `ssh -i ./attendance.pem ec2-user@ec2-1-1-1-1.eu-central-1.compute.amazonaws.com`
- Install docker and docker compose
  - Check internet for this step
- If needed, update image tags in `docker-compose.yml` file
  - When you push a new version, github workflows builds and pushes new image tags to ECR using commit hash. You can use commit hash a few minutes after pushing.
- Copy required files from repository to EC2
  - `scp -i ./attendance.pem ./docker-compose.yml nginx-compose.conf ec2-user@ec2-1-1-1-1.eu-central-1.compute.amazonaws.com:~`
- In EC2, retrieve secrets from secrets manager to .env file
  - `aws secretsmanager get-secret-value --secret-id api_secrets| jq --raw-output '.SecretString' | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > .env`
- In EC2, login to ECR
  - `aws ecr get-login-password | docker login --username AWS --password-stdin 123456789010.dkr.ecr.eu-central-1.amazonaws.com`
- In EC2, start the containers
  - `docker-compose up`

## How to connect to EC2 postgres

- Create SSH tunnel
  - `ssh -i ./attendance.pem -L 5433:localhost:5432 ec2-user@ec2-1-1-1-1.eu-central-1.compute.amazonaws.com`
- Connect to postgres with following inputs
  - host = localhost
  - port = 5433
  - Refer to secrets manager for username, password and database name
