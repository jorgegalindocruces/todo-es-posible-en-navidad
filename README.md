# Todo es posible en Navidad · Una Navidad Diferente

Web del Teatro de Navidad de 6º de Primaria del CEIP Reyes Católicos (Cádiz).
Es una web estática (HTML, CSS y JavaScript): no necesita servidor, base de datos ni instalar nada.

```
/
├── index.html          ← contenido de la web
├── css/styles.css      ← diseño (colores, tipografías…)
├── js/main.js          ← CONFIG: entradas, fechas, email, galería
├── assets/
│   ├── images/         ← fotos y cartel
│   ├── icons/          ← favicon
│   ├── og-image.svg    ← imagen para compartir (editable)
│   └── og-image.png    ← la misma imagen en PNG (la que usa WhatsApp)
├── 404.html
└── .nojekyll
```

Casi todo lo que hay que cambiar está al principio de **`js/main.js`**, en el objeto `CONFIG`.

---

## 1. Cambiar los enlaces de las entradas

En `js/main.js`, pega el enlace de cada función entre las comillas:

```js
tickets: {
  "11-dec-1730": "https://enlace-de-la-funcion-del-11",
  "12-dec-1700": "https://enlace-de-la-funcion-del-12-a-las-17",
  "12-dec-1900": "",
  "13-dec-1130": ""
},
```

- Si el enlace está vacío (`""`), el botón muestra **«Entradas próximamente»**.
- Si tiene enlace, el botón muestra **«Conseguir entrada»** y abre el enlace en otra pestaña.
- Si las cuatro funciones usan **el mismo enlace**, el botón grande «Consigue tu entrada» de la sección de entradas lleva directamente a él.

## 2. Cambiar fechas y horarios

También en `js/main.js`, en `shows`:

```js
{ id: "11-dec-1730", day: "11", month: "diciembre", weekday: "viernes", time: "17:30" },
```

Cambia `day`, `month`, `weekday` y `time`. El `id` debe coincidir con la clave usada en `tickets`.
Las tarjetas de «Elige tu función» y de «Entradas» se actualizan solas.

Hay además dos sitios con fechas escritas a mano que conviene revisar:
- `index.html`: los bloques `<noscript>` (solo se ven si el navegador no tiene JavaScript).
- `assets/og-image.svg` / `og-image.png`: la imagen para compartir dice «11, 12 y 13 de diciembre».

## 3. Añadir el cartel oficial

Para que el cartel aparezca al compartir el enlace por WhatsApp:

1. Exporta el cartel en **JPG o PNG**, idealmente de **1200 × 630 px** (horizontal). WhatsApp no muestra SVG.
2. Guárdalo como `assets/og-image.png` (sustituyendo el actual), o con otro nombre y cambia esta línea en `index.html`:
   ```html
   <meta property="og:image" content="https://jorgegalindocruces.github.io/todo-es-posible-en-navidad/assets/og-image.png">
   ```
   La dirección tiene que ser completa (con `https://`).

WhatsApp guarda en caché las vistas previas: si ya habías compartido el enlace, puede tardar en verse la imagen nueva.

## 4. Activar la galería

Usa **solo fotografías autorizadas por el colegio**.

1. Copia las fotos en `assets/images/galeria/` (mejor en `.webp` o `.jpg`, de unos 1600 px de ancho).
2. En `js/main.js`:
   ```js
   galleryEnabled: true,
   galleryPhotos: [
     { src: "assets/images/galeria/foto-1.webp", alt: "Los elfos en el ensayo general" },
     { src: "assets/images/galeria/foto-2.webp", alt: "El decorado del salón de José y Pedro" }
   ]
   ```
   Escribe en `alt` una descripción breve de cada foto (es lo que leen los lectores de pantalla).

La galería aparece entre «El viaje» y «Entradas».

## 5. Cambiar el email

En `js/main.js`:

```js
contactEmail: "viajeparis2027@gmail.com",
```

Se actualiza en la sección de contacto y en el pie. (En `index.html` también aparece escrito, por si el navegador no tiene JavaScript: cámbialo ahí también buscando `viajeparis2027`.)

## 6. Publicar en GitHub Pages

1. Sube todos los archivos a la rama `main` del repositorio.
2. En GitHub, entra en el repositorio y ve a **Settings → Pages**.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. En **Branch**, elige **`main`** y la carpeta **`/ (root)`**. Pulsa **Save**.
5. En uno o dos minutos la web estará en:
   **https://jorgegalindocruces.github.io/todo-es-posible-en-navidad/**

Si el repositorio cambia de nombre o de dueño, actualiza en `index.html` las etiquetas `og:url` y `og:image`, que necesitan la dirección completa.

Todas las rutas internas son relativas (`css/styles.css`, no `/css/styles.css`), así que la web funciona tanto en `usuario.github.io/repositorio/` como en un dominio propio.

### Probar en tu ordenador

Basta con abrir `index.html` en el navegador. Si quieres probarlo como en un servidor:

```sh
python3 -m http.server 8000
```

y abre http://localhost:8000
