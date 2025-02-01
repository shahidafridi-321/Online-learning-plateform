import React from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = ({ width = "100%", height = "100%" ,url,}) => {
	return <div>
    <ReactPlayer
    width={'100%'}
    height={'100%'}
    url={url}
    />
  </div>;
};
