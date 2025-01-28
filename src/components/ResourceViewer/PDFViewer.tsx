import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
// Use the .mjs worker
import { HighlightAnnotation, PDFResource } from '../../constants/interfaces';

import HighlightLayer from './HighlightLayer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

/**
 * Interface for props passed into PDFViewer
 */
interface PDFViewerProps {
  resource: PDFResource;
  // Not strictly required, but used to notify the parent when a page is visible:
  onPageRender?: (currentPage: number, totalPages: number) => void;
  // Optional callback if you want to capture text selection events:
  onTextSelect?: (text: string, range: Range, pageNumber: number) => void;
}

interface ObservedPageProps {
  pageNumber: number;
  totalPages: number;
  onVisible?: (pageNumber: number, totalPages: number) => void;
  width: number;
  onTextSelect?: (text: string, range: Range, pageNumber: number) => void;
  highlights?: HighlightAnnotation[];
  scrollRootRef: React.RefObject<HTMLDivElement>;
}

/**
 * ObservedPage - watchers a single PDF page, sets up IntersectionObserver based on
 * the custom root (scrollRootRef), and notifies once at least 50% is in view.
 */
const ObservedPage: React.FC<ObservedPageProps> = ({
  pageNumber,
  totalPages,
  onVisible,
  width,
  onTextSelect,
  highlights = [],
  scrollRootRef,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        // Only call onVisible when at least 50% is visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          onVisible?.(pageNumber, totalPages);
          // Unobserve so it only fires once for this page
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      });
    },
    [onVisible, pageNumber, totalPages]
  );

  // Observe this page with the custom scroll container as the root
  useEffect(() => {
    if (!isRendered || !scrollRootRef.current) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: scrollRootRef.current,
      threshold: [0.5],
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isRendered, handleIntersect, scrollRootRef]);

  // Handle text selection logic
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !onTextSelect) {
      onTextSelect?.('', null as unknown as Range, pageNumber);
      return;
    }
    const range = selection.getRangeAt(0);
    onTextSelect(selection.toString(), range, pageNumber);
  }, [onTextSelect, pageNumber]);

  // Attach/detach mouseup for text selection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mouseup', handleTextSelection);
    return () => {
      container.removeEventListener('mouseup', handleTextSelection);
    };
  }, [handleTextSelection]);

  return (
    <div ref={containerRef} style={{ marginBottom: '2rem' }} className="relative">
      <Page
        pageNumber={pageNumber}
        renderAnnotationLayer
        width={width}
        className="shadow-lg"
        onRenderSuccess={() => setIsRendered(true)}
      />
      <HighlightLayer highlights={highlights} pageNumber={pageNumber} />
    </div>
  );
};

/**
 * PDFViewer - wraps the entire PDF in a scrollable container (scrollContainerRef).
 * We pass this ref to each ObservedPage so they can observe intersection relative to it.
 */
const PDFViewer: React.FC<PDFViewerProps> = ({ resource, onPageRender, onTextSelect }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [highestPageSeen, setHighestPageSeen] = useState(0);

  // Ref for the scrollable div
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Updates total pages once the PDF is loaded
  const handleDocumentLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
  };

  // Called when a page is observed at least 50% in view
  const handlePageVisible = (pageNum: number, total: number) => {
    if (pageNum > highestPageSeen) {
      setHighestPageSeen(pageNum);
      onPageRender?.(pageNum, total);
    }
  };

  return (
    <div ref={scrollContainerRef} className="p-4 overflow-auto" style={{ height: '80vh' }}>
      <Document
        file={`file://${resource.filePath}`}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={(error) => console.error('Failed to load PDF: ', error)}
      >
        {Array.from({ length: numPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <ObservedPage
              key={pageNumber}
              pageNumber={pageNumber}
              totalPages={numPages}
              scrollRootRef={scrollContainerRef}
              onVisible={handlePageVisible}
              width={window.innerWidth - 64}
              onTextSelect={onTextSelect}
              highlights={
                resource.annotations?.filter(
                  (a) => a.annotationType === 'highlight'
                ) as HighlightAnnotation[]
              }
            />
          );
        })}
      </Document>
    </div>
  );
};

export default PDFViewer;