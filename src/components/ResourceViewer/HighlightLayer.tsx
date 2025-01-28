import React from 'react';
import { HighlightAnnotation } from '../../constants/interfaces';

interface HighlightLayerProps {
  highlights: HighlightAnnotation[];
  pageNumber: number;
}

const HighlightLayer: React.FC<HighlightLayerProps> = ({ highlights, pageNumber }) => {
  // Filter highlights for current page
  const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {pageHighlights.map((highlight) => (
        <div
          key={highlight.id}
          className="absolute bg-yellow-200 opacity-50"
          style={{
            left: highlight.position.x,
            top: highlight.position.y,
            width: highlight.position.width,
            height: highlight.position.height,
          }}
        />
      ))}
    </div>
  );
};

export default HighlightLayer; 