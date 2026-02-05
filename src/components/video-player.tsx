import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

export interface VideoPlayerRef {
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  getPlayerState: () => number;
  internalPlayer: any;
}

interface VideoPlayerProps {
  videoId: string;
  className?: string;
  onReady?: (event: any) => void;
  onStateChange?: (event: any) => void;
  onPlay?: (event: any) => void;
  onPause?: (event: any) => void;
  onEnd?: (event: any) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ videoId, className, onReady, onStateChange, onPlay, onPause, onEnd }, ref) => {
    // We store the YT player instance here
    const playerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number, allowSeekAhead = true) => {
        playerRef.current?.seekTo(seconds, allowSeekAhead);
      },
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() || 0;
      },
      pauseVideo: () => {
        playerRef.current?.pauseVideo();
      },
      playVideo: () => {
        playerRef.current?.playVideo();
      },
      getPlayerState: () => {
        return playerRef.current?.getPlayerState() || -1; // -1 is unstarted
      },
      internalPlayer: playerRef.current,
    }));

    const handleReady = (event: any) => {
      playerRef.current = event.target;
      if (onReady) {
        onReady(event);
      }
    };

    const opts: YouTubeProps['opts'] = {
      height: '100%',
      width: '100%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin, // Good practice for IFrame API
      },
    };

    return (
      <div className={className}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onStateChange={onStateChange}
          onPlay={onPlay}
          onPause={onPause}
          onEnd={onEnd}
          className="h-full w-full"
          iframeClassName="h-full w-full"
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
