# Ficheitor

Script sencillo para fichar automaticamente en Woffu a determinadas horas. El script está
preparado para ejecutarse en el free tier de Heroku, por eso la dependencia con Express
y el cron de keep alive.

## Ejecutar en modo desarrollo

1. `cp .env.example .env`.
2. Reemplazar las variables de entorno en el fichero `.env` (`NODE_ENV` debe tener el valor `development`)
3. `npm run start`.

## Ejecutar en Heroku

1. Hacer un fork de este repo.
2. Crear una nueva aplicación en Heroku.
3. Conectar la app de Heroku con el repo de GitHub.
4. Configurar las variables de entorno desde la CLI de Heroku o desde la UI (`NODE_ENV` debe tener el valor `production`)
5. Desplegar desde GitHub.
