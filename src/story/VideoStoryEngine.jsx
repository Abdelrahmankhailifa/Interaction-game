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
 * @typedef {{ id: SceneId; video: string; choices: SceneChoice[] }} SceneData
 */

/**
 * @typedef {Record<SceneId, SceneData>} SceneMap
 */

/**
 * @typedef {{
 *   scenes: SceneMap;
 *   currentSceneId: SceneId;
 *   currentScene: SceneData;
 *   goToScene: (id: SceneId) => void;
 *   restart: () => void;
 * }} VideoStoryEngineContextValue
 */

const VideoStoryEngineContext = createContext(undefined);

/**
 * @param {{ initialSceneId?: SceneId; children: React.ReactNode }} props
 */
export function VideoStoryEngineProvider({ initialSceneId = 'scene_1', children }) {
  /** @type {SceneMap} */
  const scenes = useMemo(() => scenesJson, []);

  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);

  const goToScene = useCallback(
    (id) => {
      if (!scenes[id]) {
        console.warn(`Video scene "${id}" not found in videoScenes.json`);
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

  /** @type {VideoStoryEngineContextValue} */
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


