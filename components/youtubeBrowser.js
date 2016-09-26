import React from "react";
import YouTubeTag from "react-youtube";
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

require("../style/youtubeBrowser.css");
var youtube = require('youtube-finder')

export default React.createClass({ 
  getInitialState: function() {
    return {videoListStatus: true, currentSearch: '', currentVideo: {}, videoList: [], client: youtube.createClient({ key: 'AIzaSyBf6tGxMd7YxExCOwRs4ozym1O8BPj9K4o'}) };
  },  
  componentDidMount: function() { 
    // Set a first/default search
    this.searchVideo("what's new on youtube");
 },

// Get videos by search criteria 
 searchVideo: function(text){
  var params = {
    part: 'snippet',
    q: text,
    maxResults: 5
  };
  // Get youtube client
  var client = this.state.client;
  client.search(params, function (err, data) {
    // Set a list of results
    this.setState({videoList: data.items});
    this.setState({currentSearch: text});
  }.bind(this));
},
// Set new search criteria value
handleVideoChange: function(e){
  var text = e.target.value;
  this.searchVideo(text);
  this.setState({videoListStatus: true});
},
// Set a video for current display
handleVideoSelection: function(item, e){
  this.setState({currentVideo: item});
  this.setState({videoListStatus: false});
},
// Activate list of video items
hanldeShowList: function(e){
  this.setState({videoListStatus: true});
},

render: function() {
  // Get a list of videos 
  var videoList = this.state.videoList.map(function(videoData) {
    var varVideoId = videoData.id.videoId;
    var varTitle= videoData.snippet.title;
    var varThumb = videoData.snippet.thumbnails.default;
    let boundItemClick = this.handleVideoSelection.bind(this, videoData);
    return ( 
      <div className="video-list-item-wrap row hoverable" key={varVideoId}  onClick={boundItemClick} >
      <div className="video-item-thumb col-sm-3">
      <img src={varThumb.url} width={varThumb.width} height={varThumb.height}/>
      </div>
      <div className="video-item-title col-sm-9" >
      <p>{varTitle}</p>
      </div>
      </div>
      ) ;
  }.bind(this));
  // Manage the display of selected videos
  var videoListStatus = this.state.videoListStatus;
  var currentVideo = this.state.currentVideo;
  var videoDisplay = ""; 

  if(Object.keys(currentVideo).length){ 
    var varVideoId = currentVideo.id.videoId;
    var varTitle = currentVideo.snippet.title; 
    videoDisplay = (    
    <div className="video-wrap">
    <h2>{varTitle}</h2>
    <YouTubeTag videoId={varVideoId} />
    </div>
    );
  }

  // to display the search criteria 
  var currentSearchText = !this.state.currentSearch ? null: (
      <div className="result-status-wrap" onClick={this.hanldeShowList}>
      <blockquote>
       { <p className="text-primary"> > show more results for <b>{ this.state.currentSearch}</b></p> }
      </blockquote>
    </div>    
    ) ;

  return (
   <div className="youtube-browser container-fluid">
    <div className="youtube-browser-search row well well-lg">
        <div className="youtube-browser-search-wrap col-sm-6 col-sm-offset-3">
          <input className="form-control" type="text" name='searchVideo' placeholder="Search" onChange={this.handleVideoChange}/>
        </div>
    </div>
    <div className="youtube-browser-list row ">      
      <div className="col-sm-6 col-sm-offset-3">
        { videoListStatus ? videoList : currentSearchText }
      </div>
    </div>
    <div className="youtube-browser-result row well">
      <div className="youtube-browser-result-wrap col-sm-6 col-sm-offset-3">
      { videoDisplay } 
      </div>
    </div>
   </div>
   );
},
});
