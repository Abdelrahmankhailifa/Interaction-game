'use client';

import { VideoStoryEngineProvider } from '@/story/VideoStoryEngine';
import VideoScene from '@/story/VideoScene';

export default function VideoStoryPage() {
  return (
    <VideoStoryEngineProvider initialSceneId="scene_1">
      <VideoScene />
    </VideoStoryEngineProvider>
  );
}


