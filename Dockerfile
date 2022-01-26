FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 7102

CMD [ "yarn", "dev" ]
