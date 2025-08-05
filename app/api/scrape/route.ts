import { NextRequest, NextResponse } from 'next/server';
import { scrapeProducts, scrapeRealWebsite } from '@/scripts/scraper';

// POST /api/scrape - Ejecutar scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;
    
    console.log('🚀 Iniciando scraping desde API...');
    
    if (url) {
      // Scraping de una URL específica
      await scrapeRealWebsite(url);
    } else {
      // Scraping con datos de ejemplo
      await scrapeProducts();
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scraping completado exitosamente' 
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json(
      { success: false, error: 'Error durante el scraping' },
      { status: 500 }
    );
  }
} 