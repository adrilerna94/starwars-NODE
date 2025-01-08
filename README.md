# starwars-NODE
# Ejercicio Cache de StarWars

## API Endpoints

### **/people**

#### Descripción:
- Recibe un parámetro obligatorio por **params**, que es un número del **1 al 83**.
- Recibe un parámetro opcional por **query**, que sea un boolean llamado **force**.

#### Funcionalidad:
1. Realiza una petición asíncrona a la URL `"https://www.swapi.tech/api/people"` con el parámetro proporcionado.
2. Guarda en una variable global (tipo adecuado) el **resultado** y el **timestamp** del momento en que se realiza la petición.
3. Comportamiento:
   - Si ya existe una petición hecha con el mismo parámetro dentro de los últimos **5 minutos**, devuelve los datos cacheados.
   - Si el boolean **force** es `true`, no se verifica la existencia previa:
     - Se realiza la petición a SWAPI directamente y se actualiza el cache.

---

### **/people** (Paginación)

#### Descripción:
- Recibe dos parámetros opcionales por **query** (si se envía uno, debe enviarse el otro también), llamados **page** y **limit**, que deben ser números enteros.

#### Funcionalidad:
1. **Page** indica la página que se quiere mostrar.
2. **Limit** indica el número de elementos por página.
3. Valida que **page** y **limit** sean correctos:
   - Ejemplo válido: `page=2 & limit=20`.
   - Ejemplo incorrecto: `page=4 & limit=40` (sabiendo que solo hay **83 elementos**).
4. Realiza una petición asíncrona a la URL `"https://www.swapi.tech/api/people"` con los parámetros proporcionados.
5. Guarda en una variable global (tipo adecuado) el **resultado** y el **timestamp** del momento en que se realiza la petición.
6. Comportamiento:
   - Si ya existe una petición hecha con los mismos parámetros dentro de los últimos **5 minutos**, devuelve los datos cacheados.

---

