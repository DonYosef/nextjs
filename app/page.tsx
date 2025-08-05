'use client';

import { useState, useEffect } from 'react';
import { Shield, Filter, RefreshCw, BarChart3, Car, User, DollarSign } from 'lucide-react';
import CotizacionCard from './components/CotizacionCard';
import CotizarButton from './components/CotizarButton';
import { CotizacionSeguro, PlanSeguro } from '@/lib/database';

export default function Home() {
  const [cotizaciones, setCotizaciones] = useState<CotizacionSeguro[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);

  const loadCotizaciones = async () => {
    try {
      const response = await fetch('/api/cotizaciones');
      const data = await response.json();
      
      if (data.success) {
        setCotizaciones(data.data);
        // Extraer estados únicos
        const estadosUnicos = [...new Set(data.data.map((cot: CotizacionSeguro) => cot.estado))];
        setEstados(estadosUnicos);
      }
    } catch (error) {
      console.error('Error loading cotizaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCotizaciones();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/cotizaciones?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCotizaciones(prev => prev.filter(cot => cot.id !== id));
      }
    } catch (error) {
      console.error('Error deleting cotizacion:', error);
    }
  };

  const handleSolicitarSeguro = async (id: number, plan: PlanSeguro) => {
    try {
      const response = await fetch(`/api/cotizaciones?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'solicitarSeguro',
          planSeleccionado: plan
        }),
      });
      
      if (response.ok) {
        // Recargar cotizaciones para mostrar el estado actualizado
        await loadCotizaciones();
      }
    } catch (error) {
      console.error('Error soliciting seguro:', error);
    }
  };

  const handleCotizacionComplete = () => {
    loadCotizaciones();
  };

  // Filtrar cotizaciones
  const filteredCotizaciones = cotizaciones.filter(cot => {
    if (estadoFiltro === 'todos') return true;
    return cot.estado === estadoFiltro;
  });

  // Calcular estadísticas
  const estadisticas = {
    total: cotizaciones.length,
    pendientes: cotizaciones.filter(cot => cot.estado === 'pendiente').length,
    solicitados: cotizaciones.filter(cot => cot.estado === 'solicitado').length,
    aprobados: cotizaciones.filter(cot => cot.estado === 'aprobado').length,
    rechazados: cotizaciones.filter(cot => cot.estado === 'rechazado').length,
    precioPromedio: cotizaciones.length > 0 
      ? Math.round(cotizaciones.reduce((sum, cot) => {
          const planSeleccionado = cot.planSeleccionado;
          return sum + (planSeleccionado?.precioClp || 0);
        }, 0) / cotizaciones.filter(cot => cot.planSeleccionado).length)
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard de Cotizaciones BCI
              </h1>
            </div>
            <button
              onClick={loadCotizaciones}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <User className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Solicitados</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitados}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Car className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobados}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Precio Promedio</p>
                <p className="text-2xl font-bold text-gray-900">${estadisticas.precioPromedio.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de cotización */}
          <div className="lg:col-span-1">
            <CotizarButton onCotizacionComplete={handleCotizacionComplete} />
          </div>

          {/* Lista de cotizaciones */}
          <div className="lg:col-span-3">
            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
                </div>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="solicitado">Solicitados</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                </select>
              </div>
            </div>

            {/* Lista de cotizaciones */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando cotizaciones...</p>
              </div>
            ) : filteredCotizaciones.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay cotizaciones disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCotizaciones.map((cotizacion) => (
                  <CotizacionCard
                    key={cotizacion.id}
                    cotizacion={cotizacion}
                    onDelete={handleDelete}
                    onSolicitarSeguro={handleSolicitarSeguro}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}