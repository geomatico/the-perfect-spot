# the-perfect-spot

El objetivo de “The perfect spot” es calcular a qué distancia queda un piso de una serie de puntos de interés (trabajo, casa de padres, hobbys). Así la aplicación permite evaluar diferentes opciones donde vivir, comparar la ubicación de diferentes viviendas.  

## caracteristicas

- Ubicación de puntos de interés en el mapa

- Ubicación de viviendas en el mapa

- Selección del modo de transporte.

- Cálculo de distancias y visualización en tabla y mapa

- Identificación y resaltado del punto de interés mas cercano

- Adición y eliminación de puntos de interés y viviendas
  
- Movimiento de puntos de inteŕes y vivivendas mediante el arrastre en el mapa

- Edición de nombres de puntos de interés y viviendas en la tabla

## Tecnológicas

La plataforma utiliza:
- Open Route Service (ORS) https://openrouteservice.org/ para servicios de routing externos.

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
4. Crea un archivo `.env` en el directorio raíz del proyecto y añade tu `API_KEY` de Open Route Service

## USO
Para iniciar la apliación, usa el siguiente comando:
```sh
npm start
```

Para inicar el storybook
```sh
npm run storybook
```
