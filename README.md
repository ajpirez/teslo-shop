# Description

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del archivo ```.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno.
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Ejecutar el seed ```npm run seed ``` cd/src/seed npx tsc --init
5. Correr el proyecto ```npm run dev```
6. Correr las migraciones de prisma
7. npm i prisma --save-dev
8. npx prisma init --datasource-provider PostgreSQL
9. (after create the models)npx prisma migrate dev --name ProductCategory
10. npx prisma generate (client updated)

npx prisma migrate dev --name user-role
npx prisma migrate dev -n user-adress

## Correr en prod


npm cache clean --force