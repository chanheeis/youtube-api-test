
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import YoutubeRenderer from './component/YoutubeRenderer';

import './style/App.scss';
import { parts, categories } from './api/parameters';
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
    axios.get(url)
      .then(res => {
        const filtered= res.data.items.map(item => {
          const {categoryId, channelTitle, description, title, thumbnails} = item.snippet;
          // width: 320 & height: 180
          const mediumSizeThumbnail = thumbnails.medium.url;
          return { id: item.id, categoryId, channelTitle, description, title, mediumSizeThumbnail };
        });
        setVideos(filtered);
      })
      .catch(err => console.error(err.response));
  }

  return (
    <Router>
      <div className="root">
        <div className="search">
          <input type="text" /> 
          <button>Search</button>
        </div>
        <Route path="/:videoId">
          <YoutubeRenderer />
        </Route>
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
                  <Link to={video.id}>
                    <img src={video.mediumSizeThumbnail} />
                  </Link>
                  <span>{video.title}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </Router>
  );
}

export default App;
