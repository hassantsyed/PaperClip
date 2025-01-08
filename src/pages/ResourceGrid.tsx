import React, { useState } from 'react';
import { PDFResource, Resource } from '../constants/interfaces';
import { ResourceCard } from '../components/ResourceCard';

interface ResourceGridProps {
  resources: Resource[];
  onResourceAdd: (resource: Resource) => void;
  onResourceDelete: (resourceId: string) => void;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources, onResourceAdd, onResourceDelete }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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
        content: '', // This will be populated with PDF content
        title: file.name.replace('.pdf', ''), // Remove the .pdf extension from the filename
        settledTitle: true, // Since we're using the actual filename
      };
      
      onResourceAdd(newResource);
    });
  };

  return (
    <div 
      className={`h-full w-full bg-white transition-colors duration-200
                ${isDraggingOver ? 'bg-slate-100 border-4 border-dashed border-slate-400' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDraggingOver ? (
        <div className="h-full flex items-center justify-center text-slate-500 text-xl">
          Drop files here to add them to the project
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              resource={resource}
              onDelete={() => onResourceDelete(resource.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;