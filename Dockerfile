FROM node:16.15

WORKDIR /home/app
COPY ./ /home/app

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]