import React from 'react';
import { useParams } from 'react-router-dom';

const YoutubeRenderer = () => {
  const {videoId} = useParams();
  console.log(videoId);
  //allow option 정리하기
  return (
    <iframe 
      width="560" 
      height="315" 
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
};

export default YoutubeRenderer;