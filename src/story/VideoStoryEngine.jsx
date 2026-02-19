'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import scenesJson from './videoScenes.json';

/**
 * @typedef {string} SceneId
 */

/**
 * @typedef {{ label: string; next: SceneId }} SceneChoice
 */

/**
 * @typedef {{
 *   id: SceneId;
 *   videoUrl: string;
 *   choices: SceneChoice[];
 *   isEnding?: boolean;
 *   checkpoint?: SceneId;
 * }} SceneData
 */

/**
 * @typedef {Record<SceneId, SceneData>} SceneMap
 */

const VideoStoryEngineContext = createContext(undefined);

export function VideoStoryEngineProvider({
  initialSceneId = 'intro',   // 🔥 IMPORTANT FIX
  children
}) {
  const scenes = useMemo(() => scenesJson, []);

  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);

  const goToScene = useCallback(
    (id) => {
      if (!scenes[id]) {
        console.warn(`Scene "${id}" not found in videoScenes.json`);
        return;
      }
      setCurrentSceneId(id);
    },
    [scenes]
  );

  const restart = useCallback(() => {
    setCurrentSceneId(initialSceneId);
  }, [initialSceneId]);

  const currentScene = scenes[currentSceneId];

  const value = {
    scenes,
    currentSceneId,
    currentScene,
    goToScene,
    restart,
  };

  return (
    <VideoStoryEngineContext.Provider value={value}>
      {children}
    </VideoStoryEngineContext.Provider>
  );
}

export function useVideoStoryEngine() {
  const ctx = useContext(VideoStoryEngineContext);
  if (!ctx) {
    throw new Error('useVideoStoryEngine must be used within VideoStoryEngineProvider');
  }
  return ctx;
}
