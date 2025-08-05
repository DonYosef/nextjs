import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'seguros_data.db');

// Asegurar que el directorio data existe
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface Asegurado {
  rut: number;
  dv: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: string | null;
  celular: string;
  correo: string;
  direccion: string;
}

export interface Vehiculo {
  patente: string;
  marcaId: string;
  modeloId: string;
  anio: number;
  numeroChasis: string;
  numeroMotor: string;
  codMarca: string;
  codModelo: string;
  estado: string;
  marcaDesc: string;
  modeloDesc: string;
  marcaAs400: string;
  modeloAs400: string;
  idModeloCorrelativo: number;
  color: string | null;
  rut: number;
  celular: string;
  correo: string;
}

export interface PlanSeguro {
  id?: number;
  nombre: string;
  precioClp: number;
  deducible: number;
  primaTotal: number;
  descripcion?: string;
  coberturas?: string;
  precioRecargo?: number;
  precioClpDescuento?: number;
  precioUf?: number;
  prima?: number;
  primaNeta?: number;
  valorDeducible?: number;
  cantidadCuota?: number;
  precioClp_S?: number;
  numeroCuotaGratis?: number;
}

export interface Deducible {
  id: string;
  name: string;
  valorDeducible: number | null;
  idDeducible: number | null;
  coberturaDatas: any[];
}

export interface Cobertura {
  id: number;
  planId: number;
  nombre: string;
  montoAsegurado: string;
}

export interface CotizacionSeguro {
  id?: number;
  convenioId: number;
  asegurado: Asegurado;
  vehiculo: Vehiculo;
  googleScore: number;
  planes: PlanSeguro[];
  cotizado_at: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'solicitado';
  observaciones?: string;
  cotIdentificador?: string;
  cotizacionId?: string;
  deducibles?: Deducible[];
  coberturas?: Cobertura[];
  descuento?: number;
  idTarifa?: number;
  tasaCambioUf?: number;
  cantidadCuotas?: number;
  diasVigencia?: number;
  coberturasTop?: Cobertura[];
  tipoCuota?: string;
  mensaje?: string;
  esWalletMach?: boolean;
  planSeleccionado?: PlanSeguro;
}

export async function initDatabase() {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise<void>((resolve, reject) => {
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

export async function insertCotizacion(cotizacion: Omit<CotizacionSeguro, 'id'>) {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise<void>((resolve, reject) => {
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

export async function getAllCotizaciones(): Promise<CotizacionSeguro[]> {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM cotizaciones_seguro 
      ORDER BY cotizado_at DESC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cotizaciones: CotizacionSeguro[] = rows.map(row => ({
          id: row.id,
          convenioId: row.convenioId,
          asegurado: {
            rut: row.asegurado_rut,
            dv: row.asegurado_dv,
            nombres: row.asegurado_nombres,
            apellidos: row.asegurado_apellidos,
            fechaNacimiento: row.asegurado_fechaNacimiento,
            sexo: row.asegurado_sexo,
            celular: row.asegurado_celular,
            correo: row.asegurado_correo,
            direccion: row.asegurado_direccion
          },
          vehiculo: {
            patente: row.vehiculo_patente,
            marcaId: row.vehiculo_marcaId,
            modeloId: row.vehiculo_modeloId,
            anio: row.vehiculo_anio,
            numeroChasis: row.vehiculo_numeroChasis,
            numeroMotor: row.vehiculo_numeroMotor,
            marcaDesc: row.vehiculo_marcaDesc,
            modeloDesc: row.vehiculo_modeloDesc,
            estado: row.vehiculo_estado,
            codMarca: row.vehiculo_marcaId,
            codModelo: row.vehiculo_modeloId,
            marcaAs400: '',
            modeloAs400: '',
            idModeloCorrelativo: 0,
            color: null,
            rut: row.asegurado_rut,
            celular: row.asegurado_celular,
            correo: row.asegurado_correo
          },
          googleScore: row.googleScore,
          planes: row.planes ? JSON.parse(row.planes) : [],
          cotizado_at: row.cotizado_at,
          estado: row.estado,
          observaciones: row.observaciones,
          cotIdentificador: row.cotIdentificador,
          cotizacionId: row.cotizacionId,
          deducibles: row.deducibles ? JSON.parse(row.deducibles) : [],
          coberturas: row.coberturas ? JSON.parse(row.coberturas) : [],
          descuento: row.descuento,
          idTarifa: row.idTarifa,
          tasaCambioUf: row.tasaCambioUf,
          cantidadCuotas: row.cantidadCuotas,
          diasVigencia: row.diasVigencia,
          coberturasTop: row.coberturasTop ? JSON.parse(row.coberturasTop) : [],
          tipoCuota: row.tipoCuota,
          mensaje: row.mensaje,
          esWalletMach: row.esWalletMach === 1,
          planSeleccionado: row.planSeleccionado ? JSON.parse(row.planSeleccionado) : undefined
        }));
        resolve(cotizaciones);
      }
    });
  });
}

export async function getCotizacionById(id: number): Promise<CotizacionSeguro | null> {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM cotizaciones_seguro 
      WHERE id = ?
    `, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        const cotizacion: CotizacionSeguro = {
          id: row.id,
          convenioId: row.convenioId,
          asegurado: {
            rut: row.asegurado_rut,
            dv: row.asegurado_dv,
            nombres: row.asegurado_nombres,
            apellidos: row.asegurado_apellidos,
            fechaNacimiento: row.asegurado_fechaNacimiento,
            sexo: row.asegurado_sexo,
            celular: row.asegurado_celular,
            correo: row.asegurado_correo,
            direccion: row.asegurado_direccion
          },
          vehiculo: {
            patente: row.vehiculo_patente,
            marcaId: row.vehiculo_marcaId,
            modeloId: row.vehiculo_modeloId,
            anio: row.vehiculo_anio,
            numeroChasis: row.vehiculo_numeroChasis,
            numeroMotor: row.vehiculo_numeroMotor,
            marcaDesc: row.vehiculo_marcaDesc,
            modeloDesc: row.vehiculo_modeloDesc,
            estado: row.vehiculo_estado,
            codMarca: row.vehiculo_marcaId,
            codModelo: row.vehiculo_modeloId,
            marcaAs400: '',
            modeloAs400: '',
            idModeloCorrelativo: 0,
            color: null,
            rut: row.asegurado_rut,
            celular: row.asegurado_celular,
            correo: row.asegurado_correo
          },
          googleScore: row.googleScore,
          planes: row.planes ? JSON.parse(row.planes) : [],
          cotizado_at: row.cotizado_at,
          estado: row.estado,
          observaciones: row.observaciones,
          cotIdentificador: row.cotIdentificador,
          cotizacionId: row.cotizacionId,
          deducibles: row.deducibles ? JSON.parse(row.deducibles) : [],
          coberturas: row.coberturas ? JSON.parse(row.coberturas) : [],
          descuento: row.descuento,
          idTarifa: row.idTarifa,
          tasaCambioUf: row.tasaCambioUf,
          cantidadCuotas: row.cantidadCuotas,
          diasVigencia: row.diasVigencia,
          coberturasTop: row.coberturasTop ? JSON.parse(row.coberturasTop) : [],
          tipoCuota: row.tipoCuota,
          mensaje: row.mensaje,
          esWalletMach: row.esWalletMach === 1,
          planSeleccionado: row.planSeleccionado ? JSON.parse(row.planSeleccionado) : undefined
        };
        resolve(cotizacion);
      }
    });
  });
}

export async function deleteCotizacion(id: number): Promise<void> {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.run(`
      DELETE FROM cotizaciones_seguro 
      WHERE id = ?
    `, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function updateCotizacionEstado(id: number, estado: string, observaciones?: string): Promise<void> {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE cotizaciones_seguro 
      SET estado = ?, observaciones = ?
      WHERE id = ?
    `, [estado, observaciones, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function solicitarSeguro(id: number, planSeleccionado: PlanSeguro): Promise<void> {
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE cotizaciones_seguro 
      SET estado = 'solicitado', planSeleccionado = ?
      WHERE id = ?
    `, [JSON.stringify(planSeleccionado), id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
} 