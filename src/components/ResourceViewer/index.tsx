import React, { useState } from 'react';
import { Resource } from '../../constants/interfaces';
import PDFViewer from './PDFViewer';
import { getResourceTitle } from '../../constants/utils';
import CircularProgress from './CircularProgress';

interface ResourceViewerProps {
  resource: Resource;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({ resource }) => {
  // Keep a local copy of the resource in state so we can update progress
  const [localResource, setLocalResource] = useState<Resource>(resource);

  // Callback triggered by PDFViewer on page render
  const handlePageRender = (currentPage: number, totalPages: number) => {
    const newProgress = Math.round((currentPage / totalPages) * 100);
    setLocalResource((prev) => ({
      ...prev,
      progress: newProgress,
    }));
  };

  const renderResource = () => {
    switch (localResource.resourceType) {
      case 'pdf':
        return <PDFViewer resource={localResource} onPageRender={handlePageRender} />;
      default:
        return (
          <div className="h-full flex items-center justify-center text-slate-500">
            Unsupported resource type: {localResource.resourceType}
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{getResourceTitle(localResource)}</h2>
        <div className="flex items-center gap-4">
          {/* Circular progress indicator */}
          <div className="flex items-center gap-2">
            <CircularProgress percentage={localResource.progress} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderResource()}
      </div>
    </div>
  );
};

export default ResourceViewer;