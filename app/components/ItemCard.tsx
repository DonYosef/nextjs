'use client';

import { Trash2, ExternalLink, Calendar } from 'lucide-react';
import { ScrapedItem } from '@/lib/database';

interface ItemCardProps {
  item: ScrapedItem;
  onDelete: (id: number) => void;
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-sm">Sin imagen</span>
          </div>
        )}
        
        {/* Badge de categoría */}
        {item.category && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        )}
        
        {/* Precio */}
        {item.price && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
              {item.price}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Fecha */}
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(item.scraped_at)}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Ver
              </a>
            )}
          </div>
          
          <button
            onClick={() => item.id && onDelete(item.id)}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
            title="Eliminar elemento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 