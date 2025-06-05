import React, { useState } from 'react';

interface LazyYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  isActive?: boolean;
  onActivate?: () => void;
}

export const LazyYouTube: React.FC<LazyYouTubeProps> = ({ videoId, title, className, isActive, onActivate }) => {
  return isActive ? (
    <iframe
      width="100%"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
      allowFullScreen
      className={className ? className + ' aspect-video rounded-md shadow-md' : 'aspect-video rounded-md shadow-md'}
    />
  ) : (
    <div
      className={className ? className + ' aspect-video rounded-md shadow-md cursor-pointer relative' : 'aspect-video rounded-md shadow-md cursor-pointer relative'}
      onClick={onActivate}
      tabIndex={0}
      role="button"
      aria-label={`Play YouTube video: ${title}`}
      onKeyPress={e => { if ((e.key === 'Enter' || e.key === ' ') && onActivate) onActivate(); }}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover rounded-md"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-black/60 rounded-full p-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="white"><polygon points="15,10 30,20 15,30" /></svg>
        </span>
      </div>
    </div>
  );
}; 