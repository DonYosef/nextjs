const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'seguros_data.db');

// Asegurar que el directorio data existe
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function initDatabase() {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS cotizaciones_seguro (
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
        observaciones TEXT,
        cotIdentificador TEXT,
        cotizacionId TEXT,
        planes TEXT,
        deducibles TEXT,
        coberturas TEXT,
        descuento REAL DEFAULT 0,
        idTarifa INTEGER,
        tasaCambioUf REAL,
        cantidadCuotas INTEGER,
        diasVigencia INTEGER,
        coberturasTop TEXT,
        tipoCuota TEXT,
        mensaje TEXT,
        esWalletMach BOOLEAN DEFAULT 0,
        planSeleccionado TEXT
      )
    `, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function insertCotizacion(cotizacion) {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO cotizaciones_seguro (
        convenioId, asegurado_rut, asegurado_dv, asegurado_nombres, asegurado_apellidos,
        asegurado_fechaNacimiento, asegurado_sexo, asegurado_celular, asegurado_correo,
        asegurado_direccion, vehiculo_patente, vehiculo_marcaId, vehiculo_modeloId,
        vehiculo_anio, vehiculo_numeroChasis, vehiculo_numeroMotor, vehiculo_marcaDesc,
        vehiculo_modeloDesc, vehiculo_estado, googleScore, cotizado_at, estado, observaciones,
        cotIdentificador, cotizacionId, planes, deducibles, coberturas, descuento, idTarifa,
        tasaCambioUf, cantidadCuotas, diasVigencia, coberturasTop, tipoCuota, mensaje,
        esWalletMach, planSeleccionado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      cotizacion.convenioId,
      cotizacion.asegurado.rut,
      cotizacion.asegurado.dv,
      cotizacion.asegurado.nombres,
      cotizacion.asegurado.apellidos,
      cotizacion.asegurado.fechaNacimiento,
      cotizacion.asegurado.sexo,
      cotizacion.asegurado.celular,
      cotizacion.asegurado.correo,
      cotizacion.asegurado.direccion,
      cotizacion.vehiculo.patente,
      cotizacion.vehiculo.marcaId,
      cotizacion.vehiculo.modeloId,
      cotizacion.vehiculo.anio,
      cotizacion.vehiculo.numeroChasis,
      cotizacion.vehiculo.numeroMotor,
      cotizacion.vehiculo.marcaDesc,
      cotizacion.vehiculo.modeloDesc,
      cotizacion.vehiculo.estado,
      cotizacion.googleScore,
      cotizacion.cotizado_at,
      cotizacion.estado,
      cotizacion.observaciones,
      cotizacion.cotIdentificador,
      cotizacion.cotizacionId,
      JSON.stringify(cotizacion.planes || []),
      JSON.stringify(cotizacion.deducibles || []),
      JSON.stringify(cotizacion.coberturas || []),
      cotizacion.descuento,
      cotizacion.idTarifa,
      cotizacion.tasaCambioUf,
      cotizacion.cantidadCuotas,
      cotizacion.diasVigencia,
      JSON.stringify(cotizacion.coberturasTop || []),
      cotizacion.tipoCuota,
      cotizacion.mensaje,
      cotizacion.esWalletMach ? 1 : 0,
      cotizacion.planSeleccionado ? JSON.stringify(cotizacion.planSeleccionado) : null
    ], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { initDatabase, insertCotizacion }; 