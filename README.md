# the-perfect-spot

El objetivo de “The perfect spot” es calcular a qué distancia queda un piso de una serie de puntos de interés (trabajo, casa de padres, hobbys). Así la aplicación permite evaluar diferentes opciones donde vivir, comparar la ubicación de diferentes viviendas.  

## Instalación

### Requisitos previos
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

 ### Instrucciones
1. Clona el repositorio:
    ```sh
    git clone https://github.com/geomatico/the-perfect-spot.git
    ```
2. Navega al directorio del proyecto:
    ```sh
    cd the-perfect-spot
    ```
3. Instala las dependencias:
    ```sh
    npm install
    ```

## USO
Para iniciar la apliación, usa el siguiente comando:
```sh
npm install
```

Para inicar el storybook
```sh
npm run storybook
```
La aplicación permite:

- Ubicar puntos de interés en el mapa

- Ubicar viviendas en el mapa

- Seleccionar el modo de transporte que vas a usar

- Calcular las diferentes distancias y mostrarlas en tabla y en mapa

- Calcular el punto de interés mas cercano y resaltarlo tanto en el mapa como en la tabla

- Añadir y borrar puntos de interés y viviendas
  
- Mover los puntos de interés y viviendas en el mapa arrastrándolas

- Editar los nombres de cada punto de interes y viviendas en la tabla

Tecnológicamente, la plataforma utiliza Open Route Service (ORS)  https://openrouteservice.org/ como servicio externo de routing. Precisa de una API_KEY en el archivo .env.
