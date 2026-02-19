'use client';

import { useEffect, useRef, useState } from 'react';
import { useVideoStoryEngine } from './VideoStoryEngine';

export default function VideoScene() {
  const { currentScene, goToScene, restart } = useVideoStoryEngine();
  const videoRef = useRef(null);

  const [hasEnded, setHasEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsFading(true);
    setHasEnded(false);

    const timer = setTimeout(() => setIsFading(false), 300);
    return () => clearTimeout(timer);
  }, [currentScene?.id]);

  const handleLoaded = () => {
    setIsLoading(false);
    videoRef.current?.play();
  };

  const handleEnded = () => {
    setHasEnded(true);
  };

  const handleChoiceClick = (nextId) => {
    goToScene(nextId);
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration;
    }
  };

  if (!currentScene) return <div>Scene not found</div>;

  const choices = currentScene.choices ?? [];
  const isEnding = currentScene.isEnding === true;

  return (
    <div className="story-container">
      <div className={`video-wrapper ${isFading ? 'fade-in' : ''}`}>

        <video
          ref={videoRef}
          src={currentScene.videoUrl}
          className="story-video"
          onLoadedData={handleLoaded}
          onEnded={handleEnded}
          playsInline
          preload="auto"
        />

        {isLoading && (
          <div className="video-overlay loading">
            <div className="spinner" />
          </div>
        )}

        {choices.length > 0 && hasEnded && (
          <div className="video-overlay choices-overlay">
            <div className="choices-container">
              {choices.map((choice) => (
                <button
                  key={choice.label + choice.next}
                  className="choice-button"
                  onClick={() => handleChoiceClick(choice.next)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {choices.length > 0 && !hasEnded && (
          <button className="skip-button" onClick={handleSkip}>
            Skip ⏭
          </button>
        )}

        {isEnding && hasEnded && (
          <div className="video-overlay choices-overlay">
            <div className="choices-container">
              <button
                className="choice-button ending-button"
                onClick={restart}
              >
                🔄 Restart the whole story
              </button>

              {currentScene.checkpoint && (
                <button
                  className="choice-button ending-button"
                  onClick={() => goToScene(currentScene.checkpoint)}
                >
                  ↩ Go back to last choice
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
