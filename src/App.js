
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import './style/App.scss';
import { parts, categories, regionCodes } from './api/parameters';
import utils from './utils/parsing';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_ROOT_URL;
const VIDEOS_API = `${API_URL}/videos`;

function App() {
  const [apiParams, setApiParams] = useState({
    key: API_KEY,
    part: ['snippet'],
    regionCode: 'KR',
    chart: 'mostPopular',
    videoCategoryId: 1,
  });
  
  const [videos, setVideos] = useState([]);
  const [requestURL, setRequestURL] = useState('');
  const handleRadioButton = (e) => {
    setApiParams({
      ...apiParams,
      videoCategoryId: parseInt(e.target.value)
    });
  }

  const handleChange = (e) => {
    const value = e.target.value;
    const newParts = apiParams.part.includes(value) ? 
    apiParams.part.filter(item => value !== item) :
    [...apiParams.part, value];

    setApiParams({...apiParams, part: newParts});
  }

  const apiCall = () => {
    const url = VIDEOS_API + utils.getUriFromObj(apiParams);
    setRequestURL(url);
    axios.get(url)
      .then(res => {
        const filtered= res.data.items.map(item => {
          const {categoryId, channelTitle, description, title, thumbnails} = item.snippet;
          // width: 320 & height: 180
          const mediumSizeThumbnail = thumbnails.medium.url;
          return { categoryId, channelTitle, description, title, mediumSizeThumbnail };
        });
        setVideos(filtered);
      })
      .catch(err => console.error(err.response));
  }

  return (
    <div className="root">
      <div className="search">
        <input type="text" /> 
        <button>Search</button>
      </div>
      <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/91UnVXRAlo4" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      <p>{requestURL}</p>
      <div className="part-list">
        <h2>Part</h2>
        {
          parts.map(part => {
            return (
              <div className="part-item">
                <span>{part}</span>
                <input 
                  type="checkbox"
                  value={part} 
                  defaultChecked={apiParams.part.includes(part)} 
                  onChange={handleChange} 
                />
              </div>
            )
          })
        }
      </div>
      <div className="category-list">
        <h2>Category</h2>
        {
          categories.map(category => {
            return (
              <div className="category-item">
                <span>{category.title}</span>
                <input
                  type="radio"
                  checked={apiParams.videoCategoryId === category.id ? true : false}
                  value={category.id}
                  onChange={handleRadioButton}
                />
              </div>
            )
          })
        }
      </div>
      <div className="popular-video-list">
        <h2>카테고리별 인기 동영상</h2>
        <button onClick={apiCall}>REQUEST SEND</button>
        {
          videos.map(video => {
            return (
              <div className="popular-video-item">
                <img src={video.mediumSizeThumbnail} />
                <span>{video.title}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
