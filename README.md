# Todo es posible en Navidad · Una Navidad Diferente

Web del Teatro de Navidad de 6.º de Primaria del CEIP Reyes Católicos (Cádiz).
Es una web estática (HTML, CSS y JavaScript): no necesita servidor, base de datos ni instalar nada.

```
/
├── index.html          ← contenido de la web
├── css/styles.css      ← diseño (colores, tipografías…)
├── js/main.js          ← CONFIG: entradas, fechas, email, vídeo, galería
├── assets/
│   ├── images/         ← fotos y cartel
│   ├── icons/          ← favicon
│   ├── og-image.svg    ← imagen para compartir (editable)
│   └── og-image.png    ← la misma imagen en PNG (la que usa WhatsApp)
├── 404.html
├── sitemap.xml         ← lista de páginas para Google
├── robots.txt
├── CNAME               ← dominio propio (todoesposibleteatro.es)
├── LICENSE             ← licencia MIT
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
- Si tiene enlace, el botón muestra **«Consigue tu entrada»** y abre el enlace en otra pestaña.
- Si las cuatro funciones usan **el mismo enlace**, todos los botones «Consigue tu entrada» de la página (portada, viaje y final) llevan directamente a él. Si no, bajan hasta la lista de funciones.
- Opcional, para Google: en el bloque JSON-LD de `index.html` (ver apartado 8), añade el enlace dentro de `"offers"` de esa función, por ejemplo `"url": "https://enlace-de-la-funcion-del-11",` justo encima de `"price"`.

## 2. Cambiar fechas y horarios

También en `js/main.js`, en `shows`:

```js
{ id: "11-dec-1730", day: "11", month: "diciembre", weekday: "viernes", time: "17:30" },
```

Cambia `day`, `month`, `weekday` y `time`. El `id` debe coincidir con la clave usada en `tickets`.
Las tarjetas de «Elige tu función» se actualizan solas (el día de la semana y el mes se abrevian automáticamente: «vie», «dic»).

Hay además varios sitios con fechas escritas a mano que **hay que actualizar a la vez**:
- `index.html`: las tarjetas escritas dentro de `<ul class="tickets" data-shows>`. Las lee Google y las ve quien no tiene JavaScript.
- `index.html`: la línea «11 · 12 · 13 diciembre» aparece en la portada y en el bloque final (busca `dates__days`).
- `index.html`: el bloque `<script type="application/ld+json">` del principio (datos para Google). Cambia `"startDate"` de cada función con el formato `2026-12-11T17:30:00+01:00` (año-mes-díaThora:minutos:00+01:00).
- `index.html`: las etiquetas `description`, `og:description` y `twitter:description` dicen «11, 12 y 13 de diciembre».
- `assets/og-image.svg` / `og-image.png`: la imagen para compartir dice «11, 12 y 13 de diciembre».

## 3. Añadir el cartel oficial

Para que el cartel aparezca al compartir el enlace por WhatsApp:

1. Exporta el cartel en **JPG o PNG**, idealmente de **1200 × 630 px** (horizontal). WhatsApp no muestra SVG.
2. Guárdalo como `assets/og-image.png` (sustituyendo el actual), o con otro nombre y cambia esta línea en `index.html`:
   ```html
   <meta property="og:image" content="https://todoesposibleteatro.es/assets/og-image.png">
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

La galería aparece entre «El viaje» y «Dónde», con el título «Entre bambalinas». Mientras `galleryEnabled` sea `false` (o no haya fotos), no se muestra nada.

## 5. Cambiar el vídeo de una edición anterior

En la portada hay un botón **«Ver una edición anterior»** que abre un vídeo de YouTube en una ventana dentro de la propia web (sin salir de ella). Se configura en `js/main.js`:

```js
video: {
  id: "IzQB-Fotho4",
  title: "Buscando la magia de Abraham"
},
```

- `id` es el código que aparece en la dirección de YouTube después de `watch?v=`.
- `title` es el texto que se ve encima del vídeo.
- Si dejas `id: ""`, el botón desaparece.

## 6. Cambiar el email

En `js/main.js`:

```js
contactEmail: "viajeparis2027@gmail.com",
```

Se actualiza en la sección de contacto y en el pie. (En `index.html` también aparece escrito, por si el navegador no tiene JavaScript: cámbialo ahí también buscando `viajeparis2027`.)

## 7. Publicar en GitHub Pages

La web se publica desde la rama **`gh-pages`**. En `main` se trabaja; lo que esté en `gh-pages` es lo que se ve en internet.

### Configuración (una sola vez)

1. En GitHub, entra en el repositorio y ve a **Settings → Pages**.
2. En **Build and deployment → Source**, elige **Deploy from a branch**.
3. En **Branch**, elige **`gh-pages`** y la carpeta **`/ (root)`**. Pulsa **Save**.

### Publicar cambios

Cuando los cambios estén listos en `main`, súbelos también a `gh-pages`:

```sh
git push origin main
git push origin main:gh-pages
```

En uno o dos minutos la web estará actualizada en **https://todoesposibleteatro.es/** (la dirección antigua, `jorgegalindocruces.github.io/todo-es-posible-en-navidad/`, redirige sola al dominio).

El archivo `CNAME` tiene que estar en la rama `gh-pages`; como se publica copiando `main`, basta con no borrarlo de `main`.

### Dominio propio (todoesposibleteatro.es)

El archivo `CNAME` de la raíz le dice a GitHub Pages qué dominio usar. **No lo borres.**

En el panel del proveedor donde se compró el dominio (zona DNS) tienen que estar estos registros:

| Tipo | Nombre / Host | Valor |
|------|---------------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `jorgegalindocruces.github.io.` |

Borra cualquier otro registro A, AAAA o CNAME de `@` y `www` que haya puesto el proveedor (páginas de «dominio aparcado»). Los registros MX o TXT del correo, si los hay, se dejan.

Después, en **Settings → Pages → Custom domain** debe aparecer `todoesposibleteatro.es` con el aviso «DNS check successful», y hay que marcar **Enforce HTTPS** (el certificado tarda desde unos minutos hasta 24 h en estar listo).

Si algún día la web cambia de dominio, cambia `CNAME` y busca `todoesposibleteatro.es` en `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image` y el bloque JSON-LD), en `sitemap.xml` y en `robots.txt`.

Todas las rutas internas son relativas (`css/styles.css`, no `/css/styles.css`), así que la web funciona tanto en `usuario.github.io/repositorio/` como en un dominio propio.

### Probar en tu ordenador

Basta con abrir `index.html` en el navegador. Si quieres probarlo como en un servidor:

```sh
python3 -m http.server 8000
```

y abre http://localhost:8000

## 8. SEO e indexación (que salga en Google)

La web ya lleva todo lo necesario para Google: título y descripción, dirección oficial (`canonical`), mapa del sitio (`sitemap.xml`) y **datos estructurados** de las cuatro funciones (fecha, hora, lugar y precio), que permiten que Google la muestre como evento.

Lo que **no se puede hacer automáticamente** es avisar a Google, porque hay que demostrar con una cuenta de Google que la web es tuya. Se hace una sola vez:

### Google Search Console

1. Entra en **https://search.google.com/search-console** con tu cuenta de Google.
2. Pulsa **Añadir propiedad** y elige **Dominio**. Escribe `todoesposibleteatro.es`.
3. Google te dará un registro **TXT** (empieza por `google-site-verification=`). Añádelo en la zona DNS del dominio (tipo `TXT`, nombre `@`), espera unos minutos y pulsa **Verificar**. No lo borres después.
4. En el menú de la izquierda, entra en **Sitemaps**, escribe `sitemap.xml` y pulsa **Enviar**.
5. En la barra de arriba (**Inspección de URLs**), pega la dirección de la web, espera al resultado y pulsa **Solicitar indexación**. Repítelo cada vez que hagas un cambio importante (por ejemplo, al poner los enlaces de las entradas).

Google puede tardar desde unas horas hasta un par de semanas en mostrar la web.

> **Sobre `robots.txt`:** con el dominio propio, los buscadores ya leen `https://todoesposibleteatro.es/robots.txt`, que permite rastrear toda la web e indica dónde está el mapa del sitio.

### Bing (opcional)

En **https://www.bing.com/webmasters** puedes **importar el sitio directamente desde Google Search Console** (una vez hecho lo anterior) o añadirlo a mano y enviar el mismo `sitemap.xml`. Bing también alimenta a DuckDuckGo y Ecosia.

### Comprobar los datos de las funciones

1. Abre **https://search.google.com/test/rich-results**.
2. Pega la dirección de la web y pulsa **Probar URL**.
3. Deben aparecer **4 elementos de tipo «Eventos»** sin errores. Es normal que salgan algunos avisos (por ejemplo, que falta la hora de fin): no impiden que funcione.

Vuelve a probarlo cada vez que cambies fechas, precio o enlaces. Si una función se agota, en el bloque JSON-LD de `index.html` cambia su `"availability"` a `"https://schema.org/SoldOut"`; si se cancela, cambia `"eventStatus"` a `"https://schema.org/EventCancelled"`.

## Licencia

El código de esta web es *open source* bajo licencia [MIT](LICENSE): cualquiera puede reutilizarlo y adaptarlo, por ejemplo para la web de otra obra o de otro colegio, manteniendo el aviso de copyright.
