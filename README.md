# the-perfect-spot

El objetivo de “The perfect spot” es calcular a qué distancia queda un piso de una serie de puntos de interés (trabajo, casa de padres, hobbys). Así la aplicación permite evaluar diferentes opciones donde vivir, comparar la ubicación de diferentes viviendas.  

requiere node.js y npm

 * Instalar dependencias :`npm install`.
 * ejecutar servidor local : `npm start`.
 

La aplicación permite:

- ubicar puntos de interés en el mapa

- ubicar viviendas en el mapa

- calcular las diferentes distancias y mostrarlas en tabla y en mapa

- añadir y borrar puntos de interés y viviendas

Tecnológicamente, la plataforma utiliza Open Route Service (ORS)  https://openrouteservice.org/ como servicio externo de routing. Precisa de una API_KEY en el archivo .env.
