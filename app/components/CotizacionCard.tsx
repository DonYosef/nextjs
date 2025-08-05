'use client';

import { useState } from 'react';
import { Trash2, Calendar, Car, User, Shield, DollarSign, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { CotizacionSeguro, PlanSeguro } from '@/lib/database';

interface CotizacionCardProps {
  cotizacion: CotizacionSeguro;
  onDelete: (id: number) => void;
  onSolicitarSeguro: (id: number, plan: PlanSeguro) => void;
}

export default function CotizacionCard({ cotizacion, onDelete, onSolicitarSeguro }: CotizacionCardProps) {
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanSeguro | null>(
    cotizacion.planSeleccionado || null
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRut = (rut: number, dv: string) => {
    return `${rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'solicitado':
        return 'bg-green-500';
      case 'aprobado':
        return 'bg-blue-500';
      case 'rechazado':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'solicitado':
        return 'Solicitado';
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  const handlePlanSelection = (plan: PlanSeguro) => {
    setPlanSeleccionado(plan);
  };

  const handleSolicitarSeguro = () => {
    if (planSeleccionado && cotizacion.id) {
      onSolicitarSeguro(cotizacion.id, planSeleccionado);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header con estado */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cotización #{cotizacion.id}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs text-white rounded-full ${getEstadoColor(cotizacion.estado)}`}>
              {getEstadoText(cotizacion.estado)}
            </span>
            <button
              onClick={() => cotizacion.id && onDelete(cotizacion.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Eliminar cotización"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(cotizacion.cotizado_at)}
        </div>
      </div>

      {/* Información del asegurado */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <User className="w-4 h-4 text-blue-600 mr-2" />
          <h4 className="font-medium text-gray-900">Asegurado</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Nombre:</span>
            <p className="font-medium">{cotizacion.asegurado.nombres} {cotizacion.asegurado.apellidos}</p>
          </div>
          <div>
            <span className="text-gray-600">RUT:</span>
            <p className="font-medium">{formatRut(cotizacion.asegurado.rut, cotizacion.asegurado.dv)}</p>
          </div>
          <div>
            <span className="text-gray-600">Teléfono:</span>
            <p className="font-medium">{cotizacion.asegurado.celular}</p>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <p className="font-medium">{cotizacion.asegurado.correo}</p>
          </div>
        </div>
      </div>

      {/* Información del vehículo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <Car className="w-4 h-4 text-green-600 mr-2" />
          <h4 className="font-medium text-gray-900">Vehículo</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Patente:</span>
            <p className="font-medium">{cotizacion.vehiculo.patente}</p>
          </div>
          <div>
            <span className="text-gray-600">Marca/Modelo:</span>
            <p className="font-medium">{cotizacion.vehiculo.marcaDesc} {cotizacion.vehiculo.modeloDesc}</p>
          </div>
          <div>
            <span className="text-gray-600">Año:</span>
            <p className="font-medium">{cotizacion.vehiculo.anio}</p>
          </div>
          <div>
            <span className="text-gray-600">Estado:</span>
            <p className="font-medium capitalize">{cotizacion.vehiculo.estado}</p>
          </div>
        </div>
      </div>

      {/* Planes disponibles */}
      {cotizacion.planes && cotizacion.planes.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-3">
            <DollarSign className="w-4 h-4 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-900">Planes Disponibles</h4>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cotizacion.planes.map((plan, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                  planSeleccionado?.id === plan.id && planSeleccionado?.deducible === plan.deducible
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handlePlanSelection(plan)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h5 className="font-medium text-sm text-gray-900">{plan.nombre}</h5>
                      {planSeleccionado?.id === plan.id && planSeleccionado?.deducible === plan.deducible && (
                        <CheckCircle className="w-4 h-4 text-blue-500 ml-2" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span>Deducible:</span>
                        <p className="font-medium">UF {plan.deducible}</p>
                      </div>
                      <div>
                        <span>Precio UF:</span>
                        <p className="font-medium">${plan.precioUf?.toFixed(2)}</p>
                      </div>
                      <div>
                        <span>Prima:</span>
                        <p className="font-medium">{plan.prima?.toFixed(2)}%</p>
                      </div>
                      <div>
                        <span>Cuotas:</span>
                        <p className="font-medium">{plan.cantidadCuota || 12}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg text-green-600">${plan.precioClp?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Prima total: ${plan.primaTotal?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan seleccionado */}
      {cotizacion.planSeleccionado && (
        <div className="p-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-900">Plan Seleccionado</h4>
          </div>
          <div className="bg-white p-3 rounded-md">
            <h5 className="font-medium text-sm">{cotizacion.planSeleccionado.nombre}</h5>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-600">
                Deducible: UF {cotizacion.planSeleccionado.deducible}
              </div>
              <div className="font-bold text-green-600">
                ${cotizacion.planSeleccionado.precioClp?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="p-4 bg-gray-50">
        {cotizacion.estado === 'pendiente' && (
          <button
            onClick={handleSolicitarSeguro}
            disabled={!planSeleccionado}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {planSeleccionado ? 'Solicitar Seguro' : 'Selecciona un plan'}
          </button>
        )}
        
        {cotizacion.estado === 'solicitado' && (
          <div className="text-center text-sm text-green-600">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            Seguro solicitado exitosamente
          </div>
        )}
      </div>
    </div>
  );
} 