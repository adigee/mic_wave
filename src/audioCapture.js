/**
 * AudioCapture
 * Handles microphone access and Web Audio API setup
 */
export class AudioCapture {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.stream = null;
  }

  /**
   * Request microphone access and initialize Web Audio API
   * Returns analyser node for visualization
   */
  async initialize() {
    try {
      // Request microphone permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create analyser node for frequency/time domain analysis
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048; // Power of 2, determines frequency resolution
      this.analyser.smoothingTimeConstant = 0.9; // Smoothing for visual stability

      // Create media stream source from microphone
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);

      // Connect microphone -> analyser (no output to speakers)
      this.microphone.connect(this.analyser);

      return this.analyser;
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Microphone access denied. Please allow microphone permissions.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No microphone found. Please connect a microphone.');
      } else {
        throw new Error(`Failed to initialize audio: ${error.message}`);
      }
    }
  }

  /**
   * Get buffer size for time domain data
   */
  getBufferLength() {
    return this.analyser ? this.analyser.frequencyBinCount : 0;
  }

  /**
   * Get current time domain data (waveform)
   */
  getTimeDomainData(dataArray) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(dataArray);
    }
  }

  /**
   * Clean up resources
   */
  stop() {
    if (this.microphone) {
      this.microphone.disconnect();
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.stream = null;
  }

  /**
   * Check if browser supports required APIs
   */
  static isSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      (window.AudioContext || window.webkitAudioContext)
    );
  }
}
