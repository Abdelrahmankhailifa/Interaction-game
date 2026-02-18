'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVideoStoryEngine } from './VideoStoryEngine';

/**
 * Plays the current video scene and shows branching choices over the video.
 * When a choice is clicked, it immediately switches to the next scene's video.
 */
export default function VideoScene() {
  const { currentScene, goToScene, restart } = useVideoStoryEngine();
  const videoRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Reset state when the scene changes
  useEffect(() => {
    setIsLoading(true);
    setIsFading(true);
    setHasEnded(false);

    const timer = setTimeout(() => setIsFading(false), 300);
    return () => clearTimeout(timer);
  }, [currentScene?.id]);

  const handleEnded = useCallback(() => {
    setHasEnded(true);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleChoiceClick = useCallback(
    (nextId) => {
      // Immediately switch to the next scene's video
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {
          // ignore
        }
      }
      goToScene(nextId);
    },
    [goToScene]
  );

  const handleSkip = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration;
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch (e) { /* ignore */ }
    }
    restart();
  }, [restart]);

  const handleCheckpoint = useCallback(() => {
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch (e) { /* ignore */ }
    }
    if (currentScene?.checkpoint) {
      goToScene(currentScene.checkpoint);
    }
  }, [currentScene, goToScene]);

  const handleVideoError = useCallback((e) => {
    console.error('Video error:', e);
    setIsLoading(false);
  }, []);

  if (!currentScene) {
    return (
      <div className="story-container">
        <p>Video scene not found.</p>
      </div>
    );
  }

  const choices = currentScene.choices ?? [];
  const isEnding = currentScene.isEnding === true;

  return (
    <div className="story-container">
      <div className={`video-wrapper ${isFading ? 'fade-in' : ''}`}>
        <video
          ref={videoRef}
          src={currentScene.video}
          autoPlay
          controls={false}
          playsInline
          onEnded={handleEnded}
          onLoadedData={handleLoadedData}
          onWaiting={handleWaiting}
          onCanPlay={handleLoadedData}
          onError={handleVideoError}
          className="story-video"
        >
          Your browser does not support the video tag.
        </video>

        {isLoading && (
          <div className="video-overlay loading">
            <div className="spinner" />
          </div>
        )}

        {/* Regular branching choices */}
        {choices.length > 0 && hasEnded && (
          <div className="video-overlay choices-overlay choices-slide-in">
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

        {/* Skip button (only on scenes with choices, while still playing) */}
        {choices.length > 0 && !hasEnded && (
          <button className="skip-button" onClick={handleSkip}>
            Skip ⏭
          </button>
        )}

        {/* Ending buttons: Restart or Go Back to checkpoint */}
        {isEnding && hasEnded && (
          <div className="video-overlay choices-overlay choices-slide-in">
            <div className="choices-container">
              <button className="choice-button ending-button" onClick={handleRestart}>
                🔄 Restart the whole story
              </button>
              {currentScene.checkpoint && (
                <button className="choice-button ending-button" onClick={handleCheckpoint}>
                  ↩ Go back to the last choice
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
