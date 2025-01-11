import React from 'react';
import { Resource } from '../../constants/interfaces';
import PDFViewer from './PDFViewer';
import { getResourceTitle } from '../../constants/utils';

interface ResourceViewerProps {
  resource: Resource;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({ resource }) => {
  const renderResource = () => {
    switch (resource.resourceType) {
      case 'pdf':
        return <PDFViewer resource={resource} />;
      default:
        return (
          <div className="h-full flex items-center justify-center text-slate-500">
            Unsupported resource type: {resource.resourceType}
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{getResourceTitle(resource)}</h2>
        <div className="flex items-center gap-2">
          {/* Add resource-specific actions here */}
          <span className="text-sm text-slate-500">
            {new Date(resource.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderResource()}
      </div>
    </div>
  );
};

export default ResourceViewer;