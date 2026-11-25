# Auditoría SEO de Web Pro LS

**Fecha de revisión:** 25 de noviembre de 2026
**Mercado objetivo declarado:** pymes de Chile; con foco local en Santiago y Quinta Normal.
**Objetivo:** captar solicitudes de cotización y conversaciones comerciales cualificadas.

## Alcance, fuentes y nivel de certeza

Se revisaron páginas públicas de [webprols.com](https://webprols.com/), sus archivos `robots.txt` y sitemap de Yoast, y el código disponible en este repositorio. También se consultaron páginas públicas de competidores y resultados de Bing como muestra exploratoria.

- **Comprobado:** visible en una página o archivo consultado directamente.
- **Estimación:** orientación inicial, no dato de una herramienta de keywords.
- **Recomendación:** acción propuesta, no una característica que se haya verificado.

No se tuvo acceso a Google Search Console, Google Analytics, Google Keyword Planner, al perfil de Google Business Profile, ni a datos de PageSpeed Insights/CrUX. Por ello, **no se atribuyen al sitio volúmenes exactos, posiciones, tráfico, conversiones, Core Web Vitals o número de páginas indexadas**. Un sitemap publicado y una página rastreable no prueban que Google la haya indexado.

## 1. Resumen ejecutivo

Web Pro LS ofrece diseño y desarrollo web, tiendas online, landing pages, sistemas a medida, SEO y mantenimiento. La propuesta central —crear sitios y sistemas para ayudar a crecer a negocios— es adecuada para pymes, pero la oferta pública mezcla varios servicios, beneficios genéricos y afirmaciones de rendimiento sin evidencia visible. Debe quedar más claro qué se entrega, para quién, cómo se trabaja y qué resultados se pueden demostrar.

### Hallazgo crítico: producción y repositorio no son la misma versión

Al revisar el dominio público se observó un sitio WordPress/Astra con Yoast; el repositorio contiene una aplicación Next.js. El sitemap público enumera siete páginas principales y tres artículos del blog. El código local presenta otras rutas, una nueva estructura de detalle `/blog/[slug]`, páginas de soluciones y un blog administrado mediante Supabase. No se debe asumir que los cambios del repositorio estén desplegados.

Si Next.js va a sustituir a WordPress, antes del cambio deben migrarse los contenidos reales, aplicar y verificar las migraciones de Supabase y configurar redirecciones permanentes URL a URL. Las entradas públicas actuales usan slugs en la raíz, mientras la nueva app espera slugs bajo `/blog/`. Sin una tabla de redirecciones, se arriesgan pérdidas de tráfico y enlaces entrantes; además, la ruta dinámica local `[slug]` devuelve la página de servicios ante slugs desconocidos, en vez de un 404 real.

En una prueba local anterior, `/blog` falló porque la instancia de Supabase configurada no tenía `public.blog_posts`. La migración incluida en el repositorio debe aplicarse y validarse antes de publicar esa funcionalidad.

### Prioridades de negocio

1. Acordar cuál versión del sitio es la fuente de verdad y preparar una migración sin perder URLs ni artículos.
2. Elegir páginas de servicio diferenciadas para captar búsquedas transaccionales y locales.
3. Fortalecer confianza con casos verificables, precios o alcances orientativos y autores identificables.
4. Medir contactos desde búsqueda orgánica y optimizar en función de Search Console, Analytics y datos de ventas.

## 2. Negocio, público y propuesta de valor

| Elemento | Evaluación |
|---|---|
| Objetivo | Generar cotizaciones y conversaciones comerciales para proyectos web y software a medida. |
| Público | Pymes, emprendedores y organizaciones que necesitan presencia digital, venta online o digitalización de procesos. |
| Oferta visible | Sitios corporativos, e-commerce, landing pages, branding/UX, SEO y velocidad, mantenimiento, integraciones y sistemas de gestión/reservas. |
| Ventaja potencial | Una sola contraparte que diseña y desarrolla desde una web institucional hasta un sistema ligado a los procesos del cliente. |
| Falta de claridad | No siempre se distingue qué servicio corresponde a qué tipo de empresa, qué incluye cada alcance, cuál es el proceso comercial, los plazos, el soporte y qué evidencia respalda los resultados. |
| Acción | Priorizar tres líneas de entrada: **sitios para pymes**, **e-commerce/landing pages** y **sistemas a medida**. En cada una, describir problema, alcance, entregables, plazos condicionados al proyecto, mantenimiento y CTA. |

En el sitio público, la página de servicios enumera casos como RoofFix, DigiClinic y un sistema de gestión vehicular, pero no presenta métricas verificables, plazo, alcance o testimonio junto a cada caso. Incorporar esos datos con autorización puede diferenciar más que añadir adjetivos como “disruptivo” o “alto rendimiento”.

## 3. Palabras clave: estimación inicial

Los rangos siguientes son **estimaciones de planificación**, no cifras consultadas en Keyword Planner. Consideran consultas mensuales aproximadas en Chile; deben validarse con Search Console, Keyword Planner y datos de campañas. “Dificultad SEO” es una estimación relativa de competencia orgánica (0–100), no competencia de Google Ads.

| ID | Palabra clave / clúster | Intención | Volumen estimado/mes | Competencia | Dificultad SEO |
|---|---|---|---:|---|---:|
| K1 | diseño web Chile | Comercial | 100–1.000 | Alta | 55–75 |
| K2 | diseño web Santiago / empresa diseño web Santiago | Local/comercial | 10–100 | Alta | 45–65 |
| K3 | página web para pymes / diseño web para empresas | Comercial | 10–100 | Media-alta | 30–50 |
| K4 | desarrollo web a medida Chile | Comercial | 10–100 | Media-alta | 35–55 |
| K5 | software o sistema web a medida Chile | Comercial | 10–100 | Alta | 45–65 |
| K6 | tienda online Chile / desarrollo e-commerce | Comercial/transaccional | 100–1.000 | Alta | 55–75 |
| K7 | landing page Chile / página de aterrizaje | Comercial | 10–100 | Media-alta | 35–55 |
| K8 | sistema de reservas online / software de reservas Chile | Comercial/transaccional | 10–100 | Media | 30–50 |
| K9 | mantenimiento web Chile | Transaccional | 10–100 | Media | 30–50 |
| K10 | SEO técnico Chile / optimización web | Comercial | 10–100 | Alta | 40–60 |
| K11 | cuánto cuesta una página web en Chile | Informativa/comercial | 10–100 | Alta | 35–60 |
| K12 | mejores plataformas para crear páginas web | Informativa | 100–1.000 | Alta | 60–80 |
| K13 | hosting seguro para pymes Chile | Informativa/comercial | 10–100 | Media | 30–50 |
| K14 | desarrollo/diseño web en Quinta Normal | Local | 0–10 | Baja-media | 15–35 |
| K15 | desarrollo de sistema web para [rubro] | Comercial de cola larga | 0–10 por rubro | Baja-media | 15–40 |

Los términos amplios atraen búsquedas, pero también mucha competencia y usuarios con intención distinta. Priorizar búsquedas específicas y consultas de problemas/proyectos para convertir; no crear páginas separadas para cada comuna cambiando solo el nombre.

### Mapa de palabras clave para URLs publicadas actualmente

| URL publicada | Objetivo principal recomendado | Intención y observación |
|---|---|---|
| `/` | K1, con apoyo de K3/K4 | Comercial. Mantener una propuesta amplia, pero clara y respaldada por casos. |
| `/servicios/` | K1 como página índice; distribuir K6–K10 en páginas de servicio | Comercial. No intentar posicionar todos los términos desde el mismo texto. |
| `/contacto/` | “cotizar diseño web Chile”, K2 | Transaccional/local. Formularios, WhatsApp, teléfono y ubicación consistentes. |
| `/nosotros/` | K2 y marca Web Pro LS | Comercial/local. Reforzar equipo, experiencia real, proceso y datos verificables. |
| `/metodologia/` | “proceso de desarrollo web para empresas” | Informativa/comercial. Aclarar hitos, revisiones, entregables y qué condiciona el plazo. |
| `/blog/` | “blog de diseño web, SEO y tecnología para pymes” | Informativa. El title actual es genérico y la descripción actual habla de diseño de publicaciones, no de la selección de artículos visible. |
| `/politica-de-privacidad/` | Marca + política de privacidad | Navegacional/legal. No es una página de captación; mantenerla útil y accesible. |
| `/los-mejores-hosting-en-el-mercado-con-mayor-seguridad/` | K13 | Informativa/comercial. Revisar afirmación estadística y actualizar comparativa, fecha y fuentes. |
| `/diseno-y-creacion-de-sitio-web-con-seo-optimo-y-eficiente/` | K1/K10 | Comercial/informativa. Evitar competir con la página de servicios; aportar guía práctica y derivar al servicio. |
| `/los-mejores-sitios-para-crear-paginas-web/` | K12 | Informativa. Comparación reciente, neutral, con criterios, precios/limitaciones y fecha de revisión. |
| `/category/marketing-digital/` | No asignar hasta ampliar | Archivo de categoría. Está en el sitemap; evaluar si aporta una página editorial real o si conviene excluirlo de indexación. |
| `/category/optimizacion-web/` | No asignar hasta ampliar | Archivo con riesgo de poco contenido propio. Verificar directiva `noindex` y enlaces. |
| `/category/tecnologia/` | No asignar hasta ampliar | Igual: no es una landing diferenciada por sí sola. |
| `/author/sitioswebcompragmail-com/` | Sin keyword comercial | El sitemap publica archivo de autor y los artículos muestran un correo genérico como autor. Identificar autor real con biografía y experiencia o evitar indexar archivo vacío/delgado. |

El sitemap público observado enumera siete páginas y tres entradas, además de sitemaps de categorías, etiquetas y autores. La tabla incluye las categorías y el autor que aparecen explícitamente en los sitemaps; estar en un sitemap no demuestra indexación.

### Rutas que existen solo en el código local (no confirmar como publicadas)

Si se adopta la versión Next.js, asignar una intención única a estas páginas, revisar su contenido y enlazarlas desde las páginas índice:

| Ruta del repositorio | Objetivo recomendado |
|---|---|
| `/sitios-web` | K3, diseño de sitios para pymes/empresas en Chile |
| `/sistemas-web` | K4/K5, desarrollo de sistemas web a medida |
| `/portafolio` y `/portafolio/[slug]` | “proyectos de desarrollo web” y búsquedas por caso/sector; cada caso necesita resultados verificables |
| `/soluciones/sitios-web-corporativos` | Sitios web corporativos a medida |
| `/soluciones/tiendas-online-ecommerce` | K6 |
| `/soluciones/landing-pages-express` | K7 |
| `/soluciones/erp-crm-medida` | K5 + CRM/ERP a medida |
| `/soluciones/reservas-citas` | K8 |
| `/soluciones/seo-tecnico-velocidad` | K10 |
| `/soluciones/hosting-cloud-soporte` | Hosting/mantenimiento web; precisar qué se provee y qué no |
| `/soluciones/integraciones-api-pasarelas` | Integraciones API y pasarelas |
| `/soluciones/diseno-ui-ux-branding` | Diseño UX/UI y branding |
| `/privacidad` | Página legal; redireccionar desde la URL pública actual `/politica-de-privacidad/` |
| `/blog/[slug]` | Una intención informativa por artículo, con contenido completo y metadatos propios |

Estas URLs pueden canibalizarse si repiten el mismo texto y objetivo. Antes de indexarlas, consolidar la jerarquía: inicio → servicios → página específica → caso/CTA.

## 4. Auditoría técnica

### Producción: WordPress público

| Área | Hallazgo comprobado | Acción |
|---|---|---|
| HTTPS/canonical | Las páginas consultadas responden bajo HTTPS y la home/contacto/servicios/blog exponen canonical HTTPS hacia su URL principal. | Mantener una sola variante de dominio (`https://webprols.com`) y probar redirecciones de HTTP, `www` y slash al desplegar cambios. |
| Robots | `https://webprols.com/robots.txt` permite rastreo general y enlaza `sitemap_index.xml`. | Adecuado como punto de partida. Confirmar que no se bloqueen CSS, JS o páginas públicas al cambiar de plataforma. |
| Sitemap | El índice Yoast incluye mapas de entradas, páginas, categorías, etiquetas y autores. El mapa de páginas muestra siete URLs; el de entradas, tres. | En una migración, reemplazarlo solo cuando el nuevo sitemap contenga únicamente URLs canónicas, activas y con contenido indexable. Retirar URLs antiguas solo después de redirigirlas o decidir su baja. |
| Imagen en sitemap/OG | Contacto usa el SVG `wpforms-lite/.../submit-spin.svg` como imagen principal/Open Graph y el sitemap la expone como imagen de la página. | Elegir una imagen OG de marca válida, optimizada y con dimensiones apropiadas; retirar el spinner de metadatos. |
| Datos estructurados | El JSON-LD de home y páginas consultadas incluye `WebPage`, `BreadcrumbList`, `WebSite` y `Organization`. No se observó dirección/teléfono en el objeto Organization revisado. | Completar datos solo si son correctos; añadir tipo local (`LocalBusiness`/`ProfessionalService`) solo si cumple las condiciones y coincide con el perfil real. Añadir `Service`/`Article` donde corresponda y probar con Rich Results Test. |
| URLs/404 | Las URLs públicas de páginas usan slugs legibles y slash final; los posts viven en la raíz. No se ejecutó rastreo completo de 404 ni enlaces rotos. | Exportar URLs y respuestas antes de migrar; validar con crawler y configurar 301 uno a uno. |
| Indexación Google | No se consultó Search Console ni se confirmó indexación por URL. Robots/sitemap solo acreditan disponibilidad de rastreo. | Verificar cobertura, inspección de URL, acciones manuales y sitemap en GSC. |
| Velocidad/CWV/móvil | No se obtuvieron mediciones de Lighthouse, PageSpeed Insights ni datos de campo CrUX; no se afirma una puntuación. El HTML sí incluye meta viewport. | Medir home, servicios, contacto, blog y una landing en móvil/escritorio; revisar LCP, INP y CLS en PSI/CrUX y validar formularios/CTAs en dispositivos reales. |
| Accesibilidad vinculada a SEO | En el listado de servicios, una imagen de proyecto aparece sin texto alternativo en la extracción consultada; otras imágenes sí tienen alt. No se hizo auditoría WCAG completa. | Alt descriptivo en imágenes informativas, `alt=""` para decorativas, etiquetas visibles del formulario, foco/contraste y un H1 único por página. |
| Redirecciones | No se verificó un inventario completo de redirecciones ni URLs rotas. | Crawl antes/después, preservar equivalencias, evitar cadenas y bucles, confirmar 301 y re-rastrear. |

### Código local Next.js: revisar antes de publicar

El código revisado en `app/robots.ts`, `app/sitemap.ts`, `app/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` y `lib/supabase/blog.ts` no debe confundirse con producción.

1. **Rutas desconocidas con respuesta de servicios:** el fallback de `app/[slug]/page.tsx` devuelve `ServicesPage()` para slugs que no son páginas conocidas, y sus metadatos también caen a los de servicios. Debe validar el slug y usar `notFound()`. Si no, URLs inexistentes pueden devolver 200 con contenido no relacionado (soft 404).
2. **Cambio de slugs de entradas:** las tres URLs actuales de blog son de nivel raíz; el código local propone `/blog/[slug]`. Importar contenido y crear redirecciones permanentes exactas. No asumir que las seis entradas semilla del código equivalen a los tres artículos actuales de WordPress: tienen títulos y slugs distintos.
3. **Contenido de artículos:** la lista de respaldo local contiene títulos y resúmenes; cuando no hay Supabase, el detalle devuelve `content_html` vacío. Con Supabase configurado pero sin tabla, la consulta falla. Publicar solo tras migrar y comprobar los artículos reales, cuerpos, imágenes, fecha, autor, SEO title/description y páginas de detalle.
4. **Política de privacidad:** la ruta local `/privacidad` difiere de `/politica-de-privacidad/`; definir 301 y canonical al migrar.
5. **Sitemap dinámico:** se alimenta de Supabase para blog y proyectos. Probarlo con el esquema aplicado y sin errores; evitar incluir borradores, páginas duplicadas, URLs soft-404 o canónicas distintas.

### Auditoría on-page observada y propuestas

Metadatos actuales comprobados en HTML de producción:

- **Inicio:** title “Web Pro LS - Diseño de sitios web profesionales y SEO”; descripción enfocada en diseño, branding y SEO.
- **Servicios:** title “Servicios de Desarrollo Web, Logos y Marketing - WebProLS”; H1 observado “Potencia tu negocio con WebProLS.” El title enfatiza logos/marketing mientras el contenido visible incluye webs, tiendas, sistemas y mantenimiento.
- **Contacto:** title “Contacto | Solicita tu Presupuesto Web y SEO - WebProLS”; descripción actual genérica, con imagen OG incorrecta.
- **Blog:** title “Blog | Diseño Profesional - WebProLS”; su meta description es extensa y describe diseño de publicaciones, no el listado de artículos que se muestra.
- **Nosotros:** el contenido alterna entre “WebProLS” y “Web Pro LS”; menciona WordPress/Elementor, mientras el repositorio propone una app Next.js. Alinear las afirmaciones con el servicio y la versión realmente ofrecidos.
- **Metodología:** presenta proceso de descubrimiento, UX/UI, desarrollo y lanzamiento, pero también cifras como “98% satisfacción”, “15+ días promedio”, “24/7 monitorización” y “100% propiedad código” sin evidencia o metodología visible.
- **Servicios:** aparecen “Google PageSpeed 90+”, “soporte 24/7”, “escalabilidad garantizada” y “Test A/B integrado”. Validar alcance/condiciones o retirar promesas absolutas; publicar puntuaciones solo con URL, fecha y prueba reproducible.

Propuestas de metadatos para las páginas principales (ajustar a la oferta real antes de publicar):

| Página | Title SEO propuesto | Meta description propuesta |
|---|---|---|
| Inicio | Diseño web y sistemas a medida en Chile \| Web Pro LS | Creamos sitios web y sistemas a medida para pymes en Chile. Cuéntanos tu objetivo y recibe una propuesta clara para tu proyecto. |
| Servicios | Servicios de diseño y desarrollo web en Chile \| Web Pro LS | Sitios para empresas, tiendas online, landing pages y sistemas a medida. Revisa qué incluye cada solución y solicita una cotización. |
| Sitios web | Diseño de sitios web para pymes en Chile \| Web Pro LS | Diseñamos sitios profesionales, rápidos y adaptados a tu negocio para presentar tus servicios y facilitar nuevas consultas. |
| Sistemas web | Desarrollo de sistemas web a medida en Chile \| Web Pro LS | Digitaliza procesos con sistemas web, CRM, reservas e integraciones ajustados a la operación de tu empresa. |
| Contacto | Cotiza tu sitio o sistema web en Chile \| Web Pro LS | Cuéntanos qué necesita tu negocio. Te contactaremos para entender el proyecto y definir los siguientes pasos. |
| Nosotros | Web Pro LS: desarrollo web para empresas en Chile | Conoce cómo trabajamos, quién está detrás de cada proyecto y qué experiencia tenemos en sitios y sistemas web para empresas. |
| Metodología | Proceso de desarrollo web para empresas \| Web Pro LS | Revisa las etapas, entregables y puntos de validación de un proyecto web, desde el descubrimiento hasta el lanzamiento. |
| Portafolio | Proyectos de diseño y desarrollo web \| Web Pro LS | Conoce proyectos web y sistemas desarrollados para empresas. Revisa el desafío, la solución y los resultados que podamos documentar. |
| Blog | Blog de diseño web, SEO y tecnología para pymes \| Web Pro LS | Guías prácticas para pymes sobre sitios web, e-commerce, sistemas a medida, SEO y crecimiento digital en Chile. |
| Privacidad | Política de privacidad \| Web Pro LS | Información sobre los datos que recopilamos, su uso, conservación y los canales para ejercer tus derechos. |

Usar un H1 descriptivo y único alineado con cada intención; organizar secciones con H2/H3; no repetir una misma frase exacta artificialmente. Añadir enlaces contextuales desde cada artículo a un servicio pertinente y desde cada servicio a casos relevantes y contacto. Revisar la política de privacidad con asesoría apropiada: el texto actual es genérico y no identifica claramente canales, plazos, herramientas/terceros ni el proceso de ejercicio de derechos.

## 5. Contenidos

### Qué actualizar

- **Blog:** renovar la descripción SEO del archivo; enlazar cada entrada a una página de servicio y revisar fecha, autor, imágenes, fuentes y CTA.
- **“Los Mejores Hosting…”:** el texto afirma que más del 60% de las pymes que sufren un ciberataque cierran en seis meses, sin fuente visible. Añadir fuente primaria verificable y contexto o eliminar el dato. Actualizar proveedores, precios, alcance geográfico y fecha; declarar relaciones comerciales si las hubiera.
- **“Los Mejores Sitios para Crear Páginas Web”:** incluir criterios y limitaciones comparables, precios/planes con fecha y una guía de elección genuina. Evitar que parezca una lista genérica sin evaluación propia.
- **“Diseño y Creación de Sitio Web con SEO…”:** enfocarlo en una guía útil, no en repetir el texto de la página comercial. Incorporar ejemplos propios verificables y enlaces a servicios.
- **Categorías/autor:** solo indexar archivos con contenido introductorio útil y navegación clara. Hay tres categorías y un archivo de autor en el sitemap; el autor visible en entradas es un correo genérico de Gmail, lo que reduce confianza. Usar autor real con biografía y experiencia o evitar indexar el archivo si no aporta.
- **Privacidad:** corregir el texto y añadir un canal de contacto válido, datos/terceros efectivamente usados y proceso aplicable. Evitar declarar usos de datos que no ocurren.

No eliminar artículos solo por ser antiguos. Consolidar páginas solo si se confirma solapamiento, redirigir la URL que deje de existir y preservar información útil/citas/links.

### Calendario editorial recomendado: tres meses

Ritmo inicial: dos publicaciones mensuales. Validar demanda y leads en GSC antes de escalar.

#### Mes 1

**1. Cuánto cuesta crear una página web en Chile: alcance, etapas y variables**

- **Principal:** K11. **Secundarias:** diseño web Chile, web para pymes, tienda online, mantenimiento web.
- **Intención:** informativa/comercial.
- **Estructura:** tipos de sitio; variables de alcance; diseño/contenido/integraciones; costos recurrentes; preguntas para solicitar cotización; checklist de brief.
- **Meta title:** ¿Cuánto cuesta una página web en Chile? \| Web Pro LS
- **Meta description:** Conoce qué factores influyen en el costo de una web en Chile: alcance, diseño, funciones, contenido y soporte. Prepara tu proyecto con esta guía.
- **CTA:** Solicitar evaluación del proyecto. Publicar precios concretos solo si la empresa puede mantenerlos vigentes.

**2. ¿Página web o redes sociales? Qué necesita una pyme chilena para captar clientes**

- **Principal:** K3. **Secundarias:** página web para emprendedores, diseño web Santiago, contacto/WhatsApp.
- **Intención:** informativa/comercial.
- **Estructura:** rol de cada canal; control de marca y datos; captación y medición; cuándo conviene web mínima; ejemplo verificable; lista de decisión.
- **Meta title:** Página web o redes sociales para una pyme \| Web Pro LS
- **Meta description:** Compara qué resuelven una web y las redes sociales, cuándo usar ambas y cómo elegir una presencia digital adecuada para tu pyme.
- **CTA:** Conversar sobre una web adecuada al negocio.

#### Mes 2

**3. Sistema de reservas online: funciones que necesita un negocio de servicios**

- **Principal:** K8. **Secundarias:** agenda online, reservas para profesionales, recordatorios, pagos.
- **Intención:** comercial/transaccional.
- **Estructura:** flujos de cliente y administrador; disponibilidad; confirmaciones; reprogramación; pagos y permisos; integraciones; checklist para cotizar.
- **Meta title:** Sistema de reservas online para negocios \| Web Pro LS
- **Meta description:** Revisa qué debe incluir una plataforma de reservas, desde horarios y confirmaciones hasta pagos e integración con la operación de tu negocio.
- **CTA:** Solicitar una revisión del flujo de reservas.

**4. Cómo elegir una tienda online para una pyme en Chile**

- **Principal:** K6. **Secundarias:** e-commerce Chile, pagos online, despacho, inventario.
- **Intención:** informativa/comercial.
- **Estructura:** catálogo; medios de pago; despacho/devoluciones; inventario; seguridad; integraciones; lista de salida a producción; errores frecuentes.
- **Meta title:** Cómo elegir una tienda online para tu pyme \| Web Pro LS
- **Meta description:** Evalúa catálogo, pagos, despacho, inventario e integraciones antes de lanzar una tienda online. Guía práctica para pymes en Chile.
- **CTA:** Cotizar una tienda online según catálogo y operación.

#### Mes 3

**5. Planillas, CRM o sistema a medida: cuándo conviene automatizar procesos**

- **Principal:** K5. **Secundarias:** CRM para pymes, sistema de gestión, software a medida Chile.
- **Intención:** informativa/comercial.
- **Estructura:** señales de fricción; costos de tareas manuales; opciones listas vs a medida; permisos/datos; etapas de implementación; preguntas para evaluar retorno sin promesas genéricas.
- **Meta title:** ¿CRM o sistema a medida? Guía para empresas \| Web Pro LS
- **Meta description:** Identifica cuándo una pyme puede seguir con planillas y cuándo conviene centralizar clientes, tareas y reportes en un sistema web.
- **CTA:** Describir el proceso que se busca mejorar.

**6. Rediseño web para pymes: checklist de SEO, móvil y conversiones**

- **Principal:** K1/K2. **Secundarias:** rediseño web Chile, velocidad web, SEO técnico, diseño web Santiago.
- **Intención:** informativa/comercial/local.
- **Estructura:** síntomas; auditoría antes de rediseñar; contenido/URLs/redirecciones; móvil/accesibilidad; medición; checklist de lanzamiento; caso propio solo con autorización y datos.
- **Meta title:** Checklist para rediseñar un sitio web en Chile \| Web Pro LS
- **Meta description:** Prepara un rediseño sin perder URLs ni oportunidades: revisa contenido, SEO, experiencia móvil, velocidad, formularios y medición.
- **CTA:** Solicitar diagnóstico inicial del sitio.

## 6. SEO local

- La página pública de contacto muestra **Avenida Mapocho, Quinta Normal, Santiago**, teléfono `+56 9 7971 7705` y `contacto@webprols.com`. Verificar que la dirección corresponda a un lugar elegible para mostrarse públicamente y que los datos sean idénticos en web, perfiles y directorios.
- El nombre se presenta como “Web Pro LS” y “WebProLS”. Elegir una forma y mantenerla en logo, textos, perfiles y datos estructurados.
- No se verificó un perfil de Google Business Profile ni su propiedad. Si el negocio cumple las reglas, reclamar/verificar el perfil; elegir categoría real, servicios, zona, horario, teléfono, web y fotografías propias. Si no se atiende público en la dirección, revisar si corresponde ocultarla como negocio de área de servicio.
- Priorizar Santiago y Quinta Normal. Crear una página local para Santiago solo si puede aportar información propia (proyectos, cobertura, proceso y prueba local). Extender a comunas vecinas únicamente con evidencia real; no producir páginas casi idénticas para cada comuna.
- Solicitar reseñas a clientes reales después de entregar el trabajo, sin incentivos ni filtrado de opiniones. Responderlas profesionalmente y no pedir solo reseñas positivas.
- Añadir datos locales consistentes en el sitio y schema solo si corresponden a una ubicación real. Mantener NAP (nombre, dirección, teléfono) uniforme.

## 7. Autoridad, enlaces y competencia

No se midieron backlinks, dominios de referencia ni autoridad con herramientas de pago. No asignar una puntuación de autoridad sin esos datos.

### Competidores observados

La muestra de resultados consultada fue de **Bing**, no una medición de posiciones en Google y no representa una cuota de mercado. Se observaron [Agencia Valhalla](https://agenciavalhalla.cl/), [Somos Agencia](https://somosagencia.cl/) y [Web Creativa](https://www.webcreativa.cl/). En páginas públicas revisadas, destacan:

| Competidor | Elementos visibles | Oportunidad para Web Pro LS |
|---|---|---|
| Agencia Valhalla | Propuesta orientada a conversión, portfolio y proceso visible. | Añadir alcance, etapas, caso documentado y CTA en cada página de servicio. |
| Somos Agencia | Paquetes/precios, WhatsApp, plazos y prueba social visibles (las cifras son afirmaciones del propio sitio). | Reducir incertidumbre con rangos/entregables, tiempos condicionados al alcance, reseñas verificables y respuesta directa. |
| Web Creativa | Planes/precios, FAQ, portfolio y experiencia declarada. | Mostrar proyectos con contexto y resultados comprobables; explicar qué hace diferente un sistema a medida frente a un paquete. |

Comparación cualitativa; no se verificó su tráfico ni su ranking de Google. Como la oferta incluye desarrollo a medida, competir solo por “diseño web” puede diluir el mensaje. La diferenciación más defendible es unir diseño, desarrollo y procesos de negocio, con casos reales.

### Enlaces naturales a desarrollar

- Publicar casos con autorización y pedir al cliente que los enlace desde su sección de proveedores/colaboradores, cuando sea pertinente.
- Crear guías útiles para comunidades de pymes, cámaras de comercio y redes empresariales; participar con aportes técnicos, no con enlaces masivos.
- Buscar directorios profesionales/locales legítimos y perfiles de socios tecnológicos, siempre con datos coherentes.
- Solicitar enlaces editoriales cuando una guía/caso sea realmente citado. Evitar compra masiva, intercambios artificiales, redes de sitios y directorios de baja calidad.
- Mejorar enlaces internos: servicios ↔ casos ↔ artículos ↔ contacto; añadir breadcrumbs visibles y HTML rastreable.

## 8. Conversión y experiencia de usuario

**Fortalezas observadas:** llamadas a cotizar/contactar, WhatsApp/teléfono/correo visibles, oferta variada y ejemplos de proyectos. El repositorio Next.js incluye también un formulario con campos de proyecto y estados de envío; no se da por hecho que esté desplegado.

**Fricciones y mejoras:**

1. Repetir una acción primaria consistente (“Solicitar cotización”/“Conversemos”) en móvil y escritorio; añadir una alternativa secundaria de WhatsApp.
2. En la primera pantalla, decir para qué tipo de negocio es la oferta, qué problema resuelve y qué ocurre tras enviar el formulario.
3. Mostrar alcance y factores de precio/plazo, aunque no se publique una tarifa fija.
4. Añadir casos con desafío, solución, alcance, plazo y métricas autorizadas; si no existen datos, no inventarlos.
5. En el formulario, mantener pocos campos obligatorios, explicar el uso de los datos, validar errores accesiblemente y confirmar el siguiente paso. Medir envíos completados, no solo clics.
6. Usar un CTA y mensaje de confianza junto a cada servicio; enlazar formulario con el tipo de proyecto preseleccionado cuando sea posible.
7. Probar teclado, foco, contraste, tamaño de controles y legibilidad móvil. No se realizó una prueba visual completa ni medición de conversión.

## 9. Plan priorizado por fases

Los tiempos son estimaciones para un responsable disponible; deben ajustarse a acceso, aprobaciones y alcance.

| Fase / acción | Problema y recomendación | Prioridad / impacto | Dificultad | Tiempo | Responsable |
|---|---|---|---|---|---|
| **1. Rápidas:** corregir mensaje de home/servicios | Oferta amplia y claims no demostrados. Reescribir H1/beneficios, definir tres líneas prioritarias y CTA. | Alta / alto | Baja | 1–2 días | Contenido + diseño |
| **1. Rápidas:** corregir metadatos actuales | Blog description no coincide con el archivo; servicios title incluye logos/marketing; contacto OG usa spinner. | Alta / medio-alto | Baja | 0,5–1 día | SEO + desarrollo |
| **1. Rápidas:** evidencia de confianza | Respaldar o retirar cifras “98%”, “15+ días”, “24/7”, “PageSpeed 90+” y estadística de ciberataques. | Alta / alto | Media | 2–5 días | Contenido + negocio |
| **2. Técnica:** decidir y planificar migración WP → Next | Plataformas y URLs difieren. Hacer inventario de URLs, contenido, media, metas y redirecciones antes del cambio. | **Crítica / muy alto** | Alta | 3–7 días | Desarrollo + SEO |
| **2. Técnica:** reparar 404/soft-404 y redirects | Usar `notFound()` para slugs inválidos; crear 301 de posts raíz y política; validar trailing slash/dominio. | **Crítica si se migra / muy alto** | Media | 1–3 días | Desarrollo |
| **2. Técnica:** activar y comprobar Supabase blog | Aplicar migración, importar posts actuales y validar lista, detalle y sitemap; no desplegar con tabla ausente. | **Crítica para la versión Next / muy alto** | Media | 1–3 días | Desarrollo |
| **2. Técnica:** instrumentación y rastreo | Configurar/verificar GSC, GA4 y sitemap; registrar eventos y probar indexabilidad. | Alta / alto | Media | 1–3 días | Analítica + desarrollo |
| **3. Páginas existentes:** mejorar servicios e inicio | Crear/afinar páginas de sitio, sistemas, e-commerce, landing y mantenimiento con intención distinta, pruebas y enlaces. | Alta / alto | Media | 1–2 semanas | Contenido + diseño |
| **3. Páginas existentes:** confianza/local | Completar perfil real de empresa, datos de contacto, biografía, casos y política de privacidad. | Alta / alto | Media | 1 semana | Negocio + contenido |
| **4. Nuevos contenidos:** calendario | Publicar dos guías útiles al mes y actualizar artículos existentes; interlinking desde artículo a servicio. | Media-alta / alto acumulado | Media | 3 meses | Contenido + especialista |
| **5. Autoridad/local:** reseñas y enlaces | Solicitud legítima de reseñas, casos enlazables, directorios relevantes y colaboraciones locales. | Media / alto acumulado | Media | Continuo | Marketing + negocio |
| **6. Medición/iteración** | Revisión mensual de consultas, landing pages, conversiones, términos sin CTR y calidad de leads; ejecutar cambios por evidencia. | Alta / alto | Media | 2–4 h/mes | SEO + ventas |

### Fases operativas

1. **Acciones rápidas:** metadata, propuesta de valor, CTAs, claims y enlace claro de contacto.
2. **Correcciones técnicas:** migración, 404/301, tabla/blog, canonicals, sitemap, indexación y Core Web Vitals medidos.
3. **Optimización existente:** home, servicios, contacto, nosotros, metodología, casos y contenido legal.
4. **Nuevos contenidos:** calendario editorial, páginas de solución realmente distintas y preguntas frecuentes basadas en consultas de clientes.
5. **Autoridad y local:** Google Business Profile elegible, reseñas, NAP, alianzas y casos con enlaces editoriales naturales.
6. **Medición:** ciclos mensuales, hipótesis documentadas, cambios trazables y decisiones basadas en leads, no solo sesiones.

## 10. Medición y herramientas

Configurar acceso de la empresa y retención apropiada antes de definir metas numéricas.

| Indicador | Fuente/herramienta | Frecuencia |
|---|---|---|
| Impresiones, clics, CTR, posición media y consultas | Google Search Console | Semanal; análisis mensual por página/consulta |
| Cobertura, sitemap, canonical elegida y errores de rastreo | Search Console + crawler | Semanal en migración; luego mensual |
| Sesiones orgánicas, landing pages y navegación | Google Analytics 4, con consentimiento/configuración aplicable | Mensual |
| Envío válido de formularios, clic a teléfono/WhatsApp, leads cualificados | GA4/GTM + CRM o registro comercial | Semanal/mensual |
| Ventas y cotizaciones ganadas desde orgánico | CRM con UTM/source y atribución acordada | Mensual/trimestral |
| Datos de rendimiento de campo | Search Console CWV y CrUX cuando haya datos | Mensual |
| Diagnóstico de rendimiento en laboratorio | PageSpeed Insights/Lighthouse en móvil y escritorio | Antes/después de cambios |
| Presencia local, llamadas, rutas y reseñas | Google Business Profile, si aplica | Mensual |
| Enlaces y dominios referentes | Search Console; herramientas de backlink como Ahrefs/Semrush si se dispone | Trimestral |

Registrar conversiones como eventos diferentes: `form_submit_success`, `click_whatsapp`, `click_phone` y `qualified_lead` si el CRM lo permite. Excluir envíos fallidos, validar deduplicación y no tratar un clic como una venta. Definir línea base de 28 días antes de fijar objetivos.

## Las 10 acciones SEO más importantes para ejecutar primero

1. Confirmar si el WordPress público seguirá activo o será reemplazado por Next.js.
2. Exportar las URLs, artículos, imágenes, metadatos y enlaces públicos actuales antes de migrar.
3. Crear y probar una tabla de redirecciones 301, especialmente para los tres artículos con slugs en la raíz y la política de privacidad.
4. Aplicar y verificar la migración `blog_posts`; importar el contenido real antes de habilitar `/blog` en Next.js.
5. Corregir el fallback de `[slug]` para que rutas desconocidas respondan 404, no una página de servicios.
6. Configurar/validar Search Console, Analytics y eventos de formulario/WhatsApp/llamada; obtener la línea base.
7. Reescribir title/description del blog, servicios y contacto; reemplazar el OG de contacto.
8. Aclarar la propuesta de valor y construir páginas de servicio con objetivos y contenidos diferenciados.
9. Respaldar o eliminar estadísticas y promesas de velocidad, satisfacción, plazo y soporte que no tengan evidencia verificable.
10. Publicar casos útiles y contenido editorial revisado por personas identificables; medir leads y actualizar según Search Console.

## Referencias revisadas

- [Inicio](https://webprols.com/)
- [Servicios](https://webprols.com/servicios/)
- [Contacto](https://webprols.com/contacto/)
- [Nosotros](https://webprols.com/nosotros/)
- [Metodología](https://webprols.com/metodologia/)
- [Blog](https://webprols.com/blog/)
- [Robots.txt](https://webprols.com/robots.txt)
- [Índice de sitemap](https://webprols.com/sitemap_index.xml)
- [Sitemap de páginas](https://webprols.com/page-sitemap.xml)
- [Sitemap de entradas](https://webprols.com/post-sitemap.xml)
- [Sitemap de categorías](https://webprols.com/category-sitemap.xml)
- [Sitemap de autores](https://webprols.com/author-sitemap.xml)
- Código local revisado: `app/page.tsx`, `app/[slug]/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/blog/[slug]/page.tsx`, `app/soluciones/[slug]/page.tsx`, `lib/supabase/blog.ts` y `supabase/migrations/20261125132000_blog_posts.sql`.
