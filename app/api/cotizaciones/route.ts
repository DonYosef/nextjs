import { NextRequest, NextResponse } from 'next/server';
import { getAllCotizaciones, getCotizacionById, deleteCotizacion, insertCotizacion, updateCotizacionEstado, solicitarSeguro } from '@/lib/database';

// GET /api/cotizaciones - Obtener todas las cotizaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Obtener cotización específica
      const cotizacion = await getCotizacionById(parseInt(id));
      if (!cotizacion) {
        return NextResponse.json(
          { success: false, error: 'Cotización no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json({ 
        success: true, 
        data: cotizacion
      });
    } else {
      // Obtener todas las cotizaciones
      const cotizaciones = await getAllCotizaciones();
      return NextResponse.json({ 
        success: true, 
        data: cotizaciones,
        count: cotizaciones.length 
      });
    }
  } catch (error) {
    console.error('Error fetching cotizaciones:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener las cotizaciones' },
      { status: 500 }
    );
  }
}

// POST /api/cotizaciones - Crear una nueva cotización
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCotizacion = {
      convenioId: body.convenioId,
      asegurado: body.asegurado,
      vehiculo: body.vehiculo,
      googleScore: body.googleScore,
      planes: body.planes || [],
      cotizado_at: new Date().toISOString(),
      estado: 'pendiente',
      observaciones: body.observaciones
    };
    
    await insertCotizacion(newCotizacion);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cotización creada exitosamente' 
    });
  } catch (error) {
    console.error('Error creating cotizacion:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear la cotización' },
      { status: 500 }
    );
  }
}

// DELETE /api/cotizaciones?id=123 - Eliminar una cotización
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requerido' },
        { status: 400 }
      );
    }
    
    await deleteCotizacion(parseInt(id));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cotización eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting cotizacion:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la cotización' },
      { status: 500 }
    );
  }
}

// PATCH /api/cotizaciones?id=123 - Actualizar estado de cotización o solicitar seguro
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requerido' },
        { status: 400 }
      );
    }
    
    if (body.action === 'solicitarSeguro' && body.planSeleccionado) {
      // Solicitar seguro con plan seleccionado
      await solicitarSeguro(parseInt(id), body.planSeleccionado);
      return NextResponse.json({ 
        success: true, 
        message: 'Seguro solicitado exitosamente' 
      });
    } else {
      // Actualizar estado general
      await updateCotizacionEstado(parseInt(id), body.estado, body.observaciones);
      return NextResponse.json({ 
        success: true, 
        message: 'Estado de cotización actualizado exitosamente' 
      });
    }
  } catch (error) {
    console.error('Error updating cotizacion:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la cotización' },
      { status: 500 }
    );
  }
} 