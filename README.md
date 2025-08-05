# Dashboard de Cotizaciones BCI - Next.js

Un dashboard moderno para gestionar cotizaciones de seguros automotrices obtenidas mediante la API de BCI Seguros.

## 🚀 Características

- **Cotización automática** con la API de BCI Seguros
- **Base de datos SQLite** para almacenar cotizaciones
- **Dashboard responsive** con Tailwind CSS
- **Filtros por estado** (pendiente, aprobado, rechazado)
- **API REST** completa
- **Interfaz moderna** con Lucide React icons
- **Gestión de cotizaciones** (ver, eliminar, cambiar estado)
- **Estadísticas en tiempo real**

## 📦 Instalación

```bash
npm install
```

## 🛠️ Uso

### Desarrollo
```bash
npm run dev
```

### Ejecutar Cotización
```bash
# Cotización con datos por defecto
npm run cotizar

# Cotización con datos personalizados
npm run cotizar '{"asegurado":{"rut":12345678,"dv":"9","nombres":"Juan","apellidos":"Pérez"}}'
```

## 🏗️ Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── cotizaciones/route.ts    # API para gestionar cotizaciones
│   │   └── cotizar/route.ts         # API para ejecutar cotizaciones
│   ├── components/
│   │   ├── CotizacionCard.tsx       # Componente de tarjeta de cotización
│   │   └── CotizarButton.tsx        # Componente de botón de cotización
│   ├── globals.css                  # Estilos globales
│   ├── layout.tsx                   # Layout principal
│   └── page.tsx                     # Dashboard principal
├── lib/
│   └── database.ts                  # Funciones de base de datos
├── scripts/
│   └── scraper.js                   # Script de cotización BCI
└── data/
    └── seguros_data.db              # Base de datos SQLite
```

## 🔧 API Endpoints

### GET /api/cotizaciones
Obtiene todas las cotizaciones.

**Query params:**
- `id` (opcional): Obtener cotización específica

### POST /api/cotizaciones
Crea una nueva cotización.

**Body:**
```json
{
  "convenioId": 4,
  "asegurado": {
    "rut": 10144840,
    "dv": "1",
    "nombres": "JOSÉ AQUILES",
    "apellidos": "MUÑOZ RIFFO",
    "fechaNacimiento": "1964-12-07T00:00:00",
    "celular": "91578784",
    "correo": "ignaciomgarces@gmail.com"
  },
  "vehiculo": {
    "patente": "JSBF38",
    "marcaDesc": "BAIC",
    "modeloDesc": "X35",
    "anio": 2017
  }
}
```

### DELETE /api/cotizaciones?id=123
Elimina una cotización por ID.

### PATCH /api/cotizaciones?id=123
Actualiza el estado de una cotización.

**Body:**
```json
{
  "estado": "aprobado",
  "observaciones": "Cotización aprobada"
}
```

### POST /api/cotizar
Ejecuta una cotización.

**Body:**
```json
{
  "datosPersonalizados": {
    "asegurado": {...},
    "vehiculo": {...}
  }
}
```

## 🎨 Características del Dashboard

- **Diseño responsive** que se adapta a móviles y desktop
- **Filtros dinámicos** por estado de cotización
- **Estadísticas en tiempo real** (total, pendientes, aprobadas, precio promedio)
- **Gestión visual** de cotizaciones
- **Animaciones suaves** y transiciones
- **Iconos modernos** de Lucide React
- **Formulario personalizable** para datos de cotización

## 🗄️ Base de Datos

La aplicación usa SQLite para almacenar las cotizaciones:

```sql
CREATE TABLE cotizaciones_seguro (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  convenioId INTEGER NOT NULL,
  asegurado_rut INTEGER NOT NULL,
  asegurado_dv TEXT NOT NULL,
  asegurado_nombres TEXT NOT NULL,
  asegurado_apellidos TEXT NOT NULL,
  asegurado_fechaNacimiento TEXT NOT NULL,
  asegurado_sexo TEXT,
  asegurado_celular TEXT NOT NULL,
  asegurado_correo TEXT NOT NULL,
  asegurado_direccion TEXT,
  vehiculo_patente TEXT NOT NULL,
  vehiculo_marcaId TEXT NOT NULL,
  vehiculo_modeloId TEXT NOT NULL,
  vehiculo_anio INTEGER NOT NULL,
  vehiculo_numeroChasis TEXT NOT NULL,
  vehiculo_numeroMotor TEXT NOT NULL,
  vehiculo_marcaDesc TEXT NOT NULL,
  vehiculo_modeloDesc TEXT NOT NULL,
  vehiculo_estado TEXT NOT NULL,
  googleScore INTEGER NOT NULL,
  cotizado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'pendiente',
  observaciones TEXT
);
```

## 🔄 Flujo de Trabajo

1. **Ejecutar cotización** desde el dashboard o línea de comandos
2. **Los datos se almacenan** automáticamente en SQLite
3. **El dashboard se actualiza** mostrando las nuevas cotizaciones
4. **Filtrar y gestionar** cotizaciones según estado
5. **Cambiar estado** de cotizaciones (aprobado/rechazado)

## 🛡️ Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **SQLite** - Base de datos
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Turbopack** - Desarrollo rápido

## 📝 Personalización

### Modificar la Cotización

Edita `scripts/scraper.js` para cambiar:
- Datos por defecto del asegurado
- Datos por defecto del vehículo
- Headers de autenticación
- Lógica de procesamiento de respuesta

### Agregar Nuevas Funcionalidades

- Nuevos filtros en `app/page.tsx`
- Componentes adicionales en `app/components/`
- Endpoints API en `app/api/`
- Campos adicionales en la base de datos

## 🚀 Despliegue

El proyecto está listo para desplegar en:
- **Vercel** (recomendado)
- **Netlify**
- **Railway**
- **Cualquier servidor Node.js**

## 📄 Licencia

MIT
