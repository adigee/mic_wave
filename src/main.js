import '../style.css';
import { AudioCapture } from './audioCapture.js';
import { WaveformRenderer } from './waveformRenderer.js';

/**
 * Main application controller
 */
class MicWaveApp {
  constructor() {
    this.audioCapture = null;
    this.renderer = null;
    this.dataArray = null;
    this.isRecording = false;

    // DOM elements
    this.toggleBtn = document.getElementById('toggleBtn');
    this.statusText = document.getElementById('statusText');
    this.canvas = document.getElementById('waveform');

    this.setupEventListeners();
    this.checkBrowserSupport();
  }

  /**
   * Check if browser supports required APIs
   */
  checkBrowserSupport() {
    if (!AudioCapture.isSupported()) {
      this.updateStatus('❌ Browser not supported. Please use a modern browser.', 'error');
      this.toggleBtn.disabled = true;
    }
  }

  /**
   * Setup UI event listeners
   */
  setupEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.toggle());
  }

  /**
   * Toggle between record and stop
   */
  toggle() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Start audio capture and visualization
   */
  async start() {
    try {
      this.updateStatus('🎤 Requesting microphone access...', 'loading');
      this.toggleBtn.disabled = true;

      // Initialize audio capture
      this.audioCapture = new AudioCapture();
      const analyser = await this.audioCapture.initialize();

      // Create data array for waveform samples
      const bufferLength = this.audioCapture.getBufferLength();
      this.dataArray = new Uint8Array(bufferLength);

      // Initialize renderer
      this.renderer = new WaveformRenderer(this.canvas);
      this.renderer.start(analyser, this.dataArray);

      // Update UI
      this.isRecording = true;
      this.toggleBtn.textContent = 'Stop';
      this.toggleBtn.className = 'btn-recording';
      this.toggleBtn.disabled = false;
      this.updateStatus('🔴 Recording...', 'active');

    } catch (error) {
      console.error('Failed to start:', error);
      this.updateStatus(`❌ ${error.message}`, 'error');
      this.toggleBtn.disabled = false;
      this.cleanup();
    }
  }

  /**
   * Stop audio capture and visualization
   */
  stop() {
    this.cleanup();

    // Update UI
    this.isRecording = false;
    this.toggleBtn.textContent = 'Record';
    this.toggleBtn.className = 'btn-primary';
    this.updateStatus('⏹️ Stopped', 'idle');
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.renderer) {
      this.renderer.stop();
      this.renderer = null;
    }

    if (this.audioCapture) {
      this.audioCapture.stop();
      this.audioCapture = null;
    }

    this.dataArray = null;
  }

  /**
   * Update status message
   */
  updateStatus(message, state = 'idle') {
    this.statusText.textContent = message;
    this.statusText.className = `status-${state}`;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MicWaveApp();
});
