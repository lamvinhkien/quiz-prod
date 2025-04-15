FROM node:19-alpine as build-stage
WORKDIR /usr/frontend
COPY quizFE/ .
RUN npm install
RUN npm run build

FROM nginx:1.27
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /usr/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
