'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ScrapeButtonProps {
  onScrapeComplete: () => void;
}

export default function ScrapeButton({ onScrapeComplete }: ScrapeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');

  const handleScrape = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url || undefined }),
      });

      const result = await response.json();
      
      if (result.success) {
        onScrapeComplete();
        setUrl('');
      } else {
        alert('Error durante el scraping: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error durante el scraping');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Ejecutar Scraping</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            URL (opcional - dejar vacío para datos de ejemplo)
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://ejemplo.com/productos"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        
        <button
          onClick={handleScrape}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ejecutando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              {url ? 'Scrapear URL' : 'Cargar Datos de Ejemplo'}
            </>
          )}
        </button>
        
        {!url && (
          <p className="text-sm text-gray-600 text-center">
            Se cargarán productos de ejemplo para demostración
          </p>
        )}
      </div>
    </div>
  );
} 