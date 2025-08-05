import { NextRequest, NextResponse } from 'next/server';
import { cotizarSeguroBCI, cotizarSeguroPersonalizado } from '@/scripts/scraper';

// POST /api/cotizar - Ejecutar cotización
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datosPersonalizados } = body;
    
    console.log('🚀 Iniciando cotización desde API...');
    
    let result;
    if (datosPersonalizados) {
      // Cotización con datos personalizados
      result = await cotizarSeguroPersonalizado(datosPersonalizados);
    } else {
      // Cotización con datos por defecto
      result = await cotizarSeguroBCI();
    }
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Cotización completada exitosamente',
        data: result.data || []
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during cotizacion:', error);
    return NextResponse.json(
      { success: false, error: 'Error durante la cotización' },
      { status: 500 }
    );
  }
} 