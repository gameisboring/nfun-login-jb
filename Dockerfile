FROM node:16

RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
# RUN npm install -g pm2 
RUN npm install 
COPY . /app
EXPOSE 80
ENV NODE_ENV development
ENV TZ=Asia/Seoul 
CMD ["npm", "start"]