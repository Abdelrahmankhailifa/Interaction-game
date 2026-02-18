/**
 * Audio Helper Utility
 * Handles voice-over audio playback for scenes
 */

class AudioHelper {
  constructor() {
    this.currentAudio = null;
    this.audioCache = new Map();
  }

  /**
   * Preload an audio file
   * @param {string} audioPath - Path to the audio file
   */
  preload(audioPath) {
    if (!audioPath || this.audioCache.has(audioPath)) {
      return;
    }

    const audio = new Audio(audioPath);
    audio.preload = 'auto';
    this.audioCache.set(audioPath, audio);
  }

  /**
   * Play an audio file
   * @param {string} audioPath - Path to the audio file
   * @param {boolean} loop - Whether to loop the audio
   * @returns {Promise} - Promise that resolves when audio starts playing
   */
  async play(audioPath, loop = false) {
    if (!audioPath) {
      return;
    }

    // Stop current audio if playing
    this.stop();

    // Get or create audio element
    let audio = this.audioCache.get(audioPath);
    if (!audio) {
      audio = new Audio(audioPath);
      this.audioCache.set(audioPath, audio);
    }

    audio.loop = loop;
    this.currentAudio = audio;

    try {
      await audio.play();
    } catch (error) {
      console.warn('Audio playback failed:', error);
      // Auto-play may be blocked by browser, user interaction required
    }
  }

  /**
   * Stop current audio playback
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   * @param {number} volume - Volume level
   */
  setVolume(volume) {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Clean up all audio resources
   */
  cleanup() {
    this.stop();
    this.audioCache.clear();
  }
}

// Export singleton instance
export const audioHelper = new AudioHelper();

