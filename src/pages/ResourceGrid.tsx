import React, { useState, useEffect } from 'react';
import { PDFResource, Resource, LinkResource } from '../constants/interfaces';
import { ResourceCard } from '../components/ResourceCard';

interface ResourceGridProps {
  resources: Resource[];
  onResourceAdd: (resource: Resource) => void;
  onResourceDelete: (resourceId: string) => void;
  onResourceUpdate: (resourceId: string, resource: Resource) => void;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources, onResourceAdd, onResourceDelete, onResourceUpdate }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    // Check if all dragged files are PDFs
    const files = Array.from(e.dataTransfer.items);
    const allPdfs = files.every(file => file.type === 'application/pdf');
    
    if (!allPdfs) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach(async (file) => {
      if (file.type !== 'application/pdf') {
        return;
      }
      console.log(file.name);
      const newResource: PDFResource = {
        resourceType: 'pdf',
        id: Math.random().toString(36).substring(2),
        createdAt: new Date(),
        tags: [],
        notes: [],
        annotations: [],
        progress: 0,
        content: '', // This will be populated with PDF content
        title: file.name.replace('.pdf', ''), // Remove the .pdf extension from the filename
        settledTitle: true, // Since we're using the actual filename
        loading: false,
        status: "DONE"
      };
      
      onResourceAdd(newResource);
    });
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create initial loading resource
    const newResource: LinkResource = {
        resourceType: 'link',
        id: Math.random().toString(36).substring(2),
        createdAt: new Date(),
        tags: [],
        notes: [],
        annotations: [],
        progress: 0,
        url: linkInput,
        title: 'Loading...',
        content: '',
        loading: true,
        status: "PROCESSING"
    };
    
    // Add the loading resource to the UI
    onResourceAdd(newResource);
    
    // Create the listeners
    const processedHandler = (processedResource: any) => {
        onResourceUpdate(newResource.id, processedResource);
        console.log("update handler ran");
        console.log(processedResource);
        // Clean up listeners after success
        window.electronAPI.resources.removeProcessedListener(processedHandler);
        window.electronAPI.resources.removeErrorListener(errorHandler);
    };

    const errorHandler = (error: string) => {
        onResourceDelete(newResource.id);
        console.error('Failed to process URL:', error);
        // Clean up listeners after error
        window.electronAPI.resources.removeProcessedListener(processedHandler);
        window.electronAPI.resources.removeErrorListener(errorHandler);
    };

    // Add the listeners
    window.electronAPI.resources.onProcessed(processedHandler);
    window.electronAPI.resources.onError(errorHandler);
    
    // Start processing in main thread
    window.electronAPI.resources.process(linkInput, newResource.id);
    
    setLinkInput(''); // Clear input after submission
  };

  return (
    <div 
      className={`h-full ${isDraggingOver ? 'bg-slate-100 border-4 rounded-lg border-dashed border-slate-400' : 'bg-blue-100 rounded-lg'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDraggingOver ? (
        <div className="h-full flex items-center justify-center text-slate-500 text-xl">
          Drop files here to add them to the project
        </div>
      ) : (
        <div className="flex flex-col">
          <form onSubmit={handleLinkSubmit} className="p-4">
            <div className="relative">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Paste a URL to add a resource..."
                className="w-full p-2 border-2 border-slate-400 rounded-lg focus:outline-none focus:border-black pr-10"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-black transition-colors duration-200"
              >
                ❯
              </button>
            </div>
          </form>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resources.map((resource, index) => (
              <ResourceCard
                key={index}
                resource={resource}
                onDelete={() => onResourceDelete(resource.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;