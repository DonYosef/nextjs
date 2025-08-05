'use client';

import { useState } from 'react';
import { Shield, Loader2, Car, User } from 'lucide-react';

interface CotizarButtonProps {
  onCotizacionComplete: () => void;
}

export default function CotizarButton({ onCotizacionComplete }: CotizarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
      color: null,
      rut: 10144840,
      celular: '91578784',
      correo: 'ignaciomgarces@gmail.com'
    },
    convenioId: 4,
    googleScore: 1
  });

  const handleCotizar = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/cotizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          datosPersonalizados: showForm ? formData : undefined 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onCotizacionComplete();
        setShowForm(false);
      } else {
        alert('Error durante la cotización: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error durante la cotización');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        Cotización de Seguro BCI
      </h3>
      
      <div className="space-y-4">
        {/* Botón principal */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Car className="w-4 h-4 mr-2" />
          {showForm ? 'Usar Datos por Defecto' : 'Personalizar Datos'}
        </button>

        {/* Formulario personalizado */}
        {showForm && (
          <div className="space-y-4 border-t pt-4">
            {/* Datos del asegurado */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Datos del Asegurado
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombres"
                  value={formData.asegurado.nombres}
                  onChange={(e) => updateFormData('asegurado', 'nombres', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={formData.asegurado.apellidos}
                  onChange={(e) => updateFormData('asegurado', 'apellidos', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="RUT"
                  value={formData.asegurado.rut}
                  onChange={(e) => updateFormData('asegurado', 'rut', parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="DV"
                  value={formData.asegurado.dv}
                  onChange={(e) => updateFormData('asegurado', 'dv', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="tel"
                  placeholder="Celular"
                  value={formData.asegurado.celular}
                  onChange={(e) => updateFormData('asegurado', 'celular', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.asegurado.correo}
                  onChange={(e) => updateFormData('asegurado', 'correo', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Datos del vehículo */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Car className="w-4 h-4 mr-1" />
                Datos del Vehículo
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Patente"
                  value={formData.vehiculo.patente}
                  onChange={(e) => updateFormData('vehiculo', 'patente', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Año"
                  value={formData.vehiculo.anio}
                  onChange={(e) => updateFormData('vehiculo', 'anio', parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Marca"
                  value={formData.vehiculo.marcaDesc}
                  onChange={(e) => updateFormData('vehiculo', 'marcaDesc', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Modelo"
                  value={formData.vehiculo.modeloDesc}
                  onChange={(e) => updateFormData('vehiculo', 'modeloDesc', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botón de cotización */}
        <button
          onClick={handleCotizar}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Cotizando...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              {showForm ? 'Cotizar con Datos Personalizados' : 'Cotizar con Datos por Defecto'}
            </>
          )}
        </button>
        
        {!showForm && (
          <p className="text-sm text-gray-600 text-center">
            Se usarán los datos de ejemplo para la cotización
          </p>
        )}
      </div>
    </div>
  );
} 