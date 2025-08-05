import { NextRequest, NextResponse } from 'next/server';
import { getAllScrapedItems, getScrapedItemsByCategory, deleteScrapedItem, insertScrapedItem } from '@/lib/database';

// GET /api/items - Obtener todos los elementos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let items;
    if (category) {
      items = await getScrapedItemsByCategory(category);
    } else {
      items = await getAllScrapedItems();
    }
    
    return NextResponse.json({ 
      success: true, 
      data: items,
      count: items.length 
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los elementos' },
      { status: 500 }
    );
  }
}

// POST /api/items - Crear un nuevo elemento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newItem = {
      title: body.title,
      description: body.description,
      url: body.url,
      price: body.price,
      image: body.image,
      category: body.category,
      scraped_at: new Date().toISOString()
    };
    
    await insertScrapedItem(newItem);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Elemento creado exitosamente' 
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear el elemento' },
      { status: 500 }
    );
  }
}

// DELETE /api/items?id=123 - Eliminar un elemento
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
    
    await deleteScrapedItem(parseInt(id));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Elemento eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el elemento' },
      { status: 500 }
    );
  }
} 