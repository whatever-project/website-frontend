FROM node:20-alpine
WORKDIR /code
COPY package.json ./
COPY .env ./
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/boot.js"]
