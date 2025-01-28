import React, { useState, useEffect } from 'react';
import { Resource, HighlightAnnotation } from '../../constants/interfaces';
import PDFViewer from './PDFViewer';
import { getResourceTitle } from '../../constants/utils';
import CircularProgress from './CircularProgress';

interface ResourceViewerProps {
  resource: Resource;
  onResourceUpdate: (resourceId: string, updates: Partial<Resource>) => void;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({
  resource,
  onResourceUpdate,
}) => {
  const [localResource, setLocalResource] = useState<Resource>(resource);
  const [selectedText, setSelectedText] = useState<{
    text: string;
    range: Range;
    pageNumber: number;
  } | null>(null);

  // Sync localResource when resource prop changes
  useEffect(() => {
    setLocalResource(resource);
    // Clear any selected text when switching resources
    setSelectedText(null);
  }, [resource]);

  const handlePageRender = (currentPage: number, totalPages: number) => {
    const newProgress = Math.round((currentPage / totalPages) * 100);
    // Only update if the new progress is higher than current
    if (newProgress > (localResource.progress || 0)) {
      setLocalResource((prev) => ({
        ...prev,
        progress: newProgress,
      }));
      // Persist the progress update
      onResourceUpdate?.(resource.id, { progress: newProgress });
    }
  };

  const handleTextSelect = (text: string, range: Range, pageNumber: number) => {
    if (!text || !range) {
      setSelectedText(null);
      return;
    }
    setSelectedText({ text, range, pageNumber });
  };

  const handleHighlight = () => {
    if (!selectedText) return;

    const { text, range, pageNumber } = selectedText;
    const rect = range.getBoundingClientRect();

    // Get the PDF page element
    const pageElement = range.startContainer.parentElement?.closest(
      '.react-pdf__Page'
    );
    if (!pageElement) return;

    // Get page position
    const pageRect = pageElement.getBoundingClientRect();

    // Find all text nodes before the selection
    const walker = document.createTreeWalker(
      range.startContainer,
      NodeFilter.SHOW_TEXT,
      null
    );

    let startOffset = 0;
    let node = walker.nextNode();

    // Count characters until we reach the start container
    while (node && node !== range.startContainer) {
      startOffset += node.textContent?.length || 0;
      node = walker.nextNode();
    }

    // Add the range's start offset
    startOffset += range.startOffset;

    const annotation: HighlightAnnotation = {
      id: Math.random().toString(36).substring(2),
      annotationType: 'highlight',
      createdAt: new Date(),
      highlightedText: text,
      pageNumber,
      position: {
        x: rect.left - pageRect.left,
        y: rect.top - pageRect.top,
        width: rect.width,
        height: rect.height,
      },
      textRange: {
        start: startOffset,
        end: startOffset + text.length,
      },
      color: '#ffeb3b',
    };

    // Update both local state and persist to store
    setLocalResource((prev) => ({
      ...prev,
      annotations: [...(prev.annotations || []), annotation],
    }));

    // Persist to store using existing handler
    onResourceUpdate?.(resource.id, {
      annotations: [...(resource.annotations || []), annotation],
    });

    // Clear selection
    window.getSelection()?.removeAllRanges();
    setSelectedText(null);
  };

  const renderResource = () => {
    switch (localResource.resourceType) {
      case 'pdf':
        return (
          <PDFViewer
            resource={localResource}
            onPageRender={handlePageRender}
            onTextSelect={handleTextSelect}
          />
        );
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
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{getResourceTitle(localResource)}</h2>
          <div className="flex items-center gap-4">
            <CircularProgress 
              percentage={localResource.progress} 
              onMarkAsRead={() => {
                setLocalResource(prev => ({ ...prev, progress: 100 }));
                onResourceUpdate?.(resource.id, { progress: 100 });
              }}
            />
          </div>
        </div>
        {/* Simplified slide-out toolbar */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            selectedText ? 'h-12' : 'h-0'
          }`}
        >
          <div className="flex items-center px-4 py-2 bg-slate-100">
            <button
              onClick={handleHighlight}
              className="p-2 hover:bg-yellow-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <span role="img" aria-label="highlight" className="text-yellow-500">
                ✨
              </span>
              <span className="text-sm">Highlight</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{renderResource()}</div>
    </div>
  );
};

export default ResourceViewer;