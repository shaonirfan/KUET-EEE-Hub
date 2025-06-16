'use client';

import React, { useState, useEffect } from 'react';
import { Resource } from '@/types/resource';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResources(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      }
    };

    fetchResources();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Resources</h2>
            <p className="text-gray-600 mb-4">
              There was an issue fetching the resources from Google Sheets.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-800 mb-2">Troubleshooting Steps:</h3>
              <ul className="list-disc list-inside space-y-2 text-red-700">
                <li>Ensure the <code className="bg-red-100 px-1 rounded">GOOGLE_RESOURCES_SHEET_ID</code> in your environment variables is correctly set.</li>
                <li>Verify that your Google Sheet is shared with the service account email with "Viewer" permissions.</li>
                <li>Check that your sheet has the correct column headers matching the expected format.</li>
                <li>Make sure your service account credentials are properly configured.</li>
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Error details: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
          {resources.length === 0 ? (
            <p className="text-gray-500">No resources found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{resource.name}</h2>
                  <p className="text-gray-600 mb-2">{resource.description}</p>
                  {resource.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mb-2">
                      {resource.category}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag: string) => (
                      <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={resource.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 