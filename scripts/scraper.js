const axios = require('axios');
const { initDatabase, insertCotizacion } = require('../lib/database.js');

async function cotizarSeguroBCI() {
  const url = 'https://apigwp.bciseguros.cl:8443/Apiventaasistida/cotizacion/directo';

  const payload = {
    convenioId: 4,
    asegurado: {
      rut: 10144840,
      dv: '1',
      nombres: 'JOSÉ AQUILES',
      apellidos: 'MUÑOZ RIFFO',
      fechaNacimiento: '1964-12-07T00:00:00',
      sexo: null,
      celular: '91578784',
      correo: 'ignaciomgarces@gmail.com',
      direccion: ''
    },
    vehiculo: {
      patente: 'JSBF38',
      marcaId: '250',
      modeloId: '2835',
      anio: 2017,
      numeroChasis: 'LNBSCUAH3HF594462',
      numeroMotor: 'A151BM02H321621',
      codMarca: '250',
      codModelo: '2835',
      estado: 'usado',
      marcaDesc: 'BAIC',
      modeloDesc: 'X35',
      marcaAs400: 'BAI',
      modeloAs400: '06',
      idModeloCorrelativo: 2835,
      mensajeValidaFecha: null,
      color: null,
      rut: 10144840,
      celular: '91578784',
      correo: 'ignaciomgarces@gmail.com'
    },
    googleScore: 1
  };

  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://cotizadordirecto2.bciseguros.cl',
    'Referer': 'https://cotizadordirecto2.bciseguros.cl/',
    'User-Agent': 'Mozilla/5.0',
    'authorization': 'bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjY0MzVlN2UwLTAxOGUtNDQ5My1iYjhiLTIxNGIxOGZjZGEzYSIsImp0aSI6ImZhZGY1YjVlLWEyYTktNGUwMi04OGNhLTVhZTQxZDM2NDViMyIsIm5iZiI6MTc1NDQzMTM4NywiZXhwIjoxNzU0NDMzMTg3LCJpYXQiOjE3NTQ0MzEzODcsImlzcyI6Imh0dHBzOi8vdmVudGFhc2lzdGlkYS5iY2lzZWd1cm9zLmNsIiwiYXVkIjoiaHR0cHM6Ly92ZW50YWFzaXN0aWRhLmJjaXNlZ3Vyb3MuY2wifQ.8Nb6ElnZMXyFRZAf1dwRYKyKHKumodUgH-qjTqr_IiguC8sY5bjgvcHQkH1xVJ1ANdms3B_v9bmQLKxU5WYbCg'
  };

  try {
    // Inicializar base de datos
    await initDatabase();
    
    const res = await axios.post(url, payload, { headers });

    // Guardar cotización en la base de datos con toda la información
    const cotizacion = {
      convenioId: payload.convenioId,
      asegurado: payload.asegurado,
      vehiculo: payload.vehiculo,
      googleScore: payload.googleScore,
      planes: res.data.planes || [],
      cotizado_at: new Date().toISOString(),
      estado: 'pendiente',
      cotIdentificador: res.data.cotIdentificador,
      cotizacionId: res.data.cotizacionId,
      deducibles: res.data.deducibles || [],
      coberturas: res.data.coberturas || [],
      descuento: res.data.descuento || 0,
      idTarifa: res.data.idTarifa,
      tasaCambioUf: res.data.tasaCambioUf,
      cantidadCuotas: res.data.cantidadCuotas,
      diasVigencia: res.data.diasVigencia,
      coberturasTop: res.data.coberturasTop || [],
      tipoCuota: res.data.tipoCuota,
      mensaje: res.data.mensaje,
      esWalletMach: res.data.esWalletMach
    };

    await insertCotizacion(cotizacion);
    return { success: true, data: res.data };

  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
}

// Función para cotizar con datos personalizados
async function cotizarSeguroPersonalizado(datos) {
  const url = 'https://apigwp.bciseguros.cl:8443/Apiventaasistida/cotizacion/directo';

  const payload = {
    convenioId: datos.convenioId || 4,
    asegurado: datos.asegurado,
    vehiculo: datos.vehiculo,
    googleScore: datos.googleScore || 1
  };

  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://cotizadordirecto2.bciseguros.cl',
    'Referer': 'https://cotizadordirecto2.bciseguros.cl/',
    'User-Agent': 'Mozilla/5.0',
    'authorization': 'bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjY0MzVlN2UwLTAxOGUtNDQ5My1iYjhiLTIxNGIxOGZjZGEzYSIsImp0aSI6ImZhZGY1YjVlLWEyYTktNGUwMi04OGNhLTVhZTQxZDM2NDViMyIsIm5iZiI6MTc1NDQzMTM4NywiZXhwIjoxNzU0NDMzMTg3LCJpYXQiOjE3NTQ0MzEzODcsImlzcyI6Imh0dHBzOi8vdmVudGFhc2lzdGlkYS5iY2lzZWd1cm9zLmNsIiwiYXVkIjoiaHR0cHM6Ly92ZW50YWFzaXN0aWRhLmJjaXNlZ3Vyb3MuY2wifQ.8Nb6ElnZMXyFRZAf1dwRYKyKHKumodUgH-qjTqr_IiguC8sY5bjgvcHQkH1xVJ1ANdms3B_v9bmQLKxU5WYbCg'
  };

  try {
    // Inicializar base de datos
    await initDatabase();
    
    const res = await axios.post(url, payload, { headers });

    // Guardar cotización en la base de datos con toda la información
    const cotizacion = {
      convenioId: payload.convenioId,
      asegurado: payload.asegurado,
      vehiculo: payload.vehiculo,
      googleScore: payload.googleScore,
      planes: res.data.planes || [],
      cotizado_at: new Date().toISOString(),
      estado: 'pendiente',
      cotIdentificador: res.data.cotIdentificador,
      cotizacionId: res.data.cotizacionId,
      deducibles: res.data.deducibles || [],
      coberturas: res.data.coberturas || [],
      descuento: res.data.descuento || 0,
      idTarifa: res.data.idTarifa,
      tasaCambioUf: res.data.tasaCambioUf,
      cantidadCuotas: res.data.cantidadCuotas,
      diasVigencia: res.data.diasVigencia,
      coberturasTop: res.data.coberturasTop || [],
      tipoCuota: res.data.tipoCuota,
      mensaje: res.data.mensaje,
      esWalletMach: res.data.esWalletMach
    };

    await insertCotizacion(cotizacion);
    return { success: true, data: res.data };

  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
}

// Ejecutar cotización
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Si se proporcionan datos personalizados
    try {
      const datos = JSON.parse(args[0]);
      cotizarSeguroPersonalizado(datos);
    } catch (error) {
      cotizarSeguroBCI(); // Usar datos por defecto
    }
  } else {
    // Usar datos por defecto
    cotizarSeguroBCI();
  }
}

module.exports = { cotizarSeguroBCI, cotizarSeguroPersonalizado }; 