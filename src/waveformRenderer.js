/**
 * WaveformRenderer
 * Renders real-time audio waveform on canvas
 */
export class WaveformRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;
    this.isRendering = false;

    // Set canvas resolution for crisp rendering
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Adjust canvas size to match display size with proper DPR
   */
  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    // Store display dimensions for drawing
    this.width = rect.width;
    this.height = rect.height;
  }

  /**
   * Start rendering loop
   */
  start(analyser, dataArray) {
    if (this.isRendering) return;

    this.isRendering = true;
    const render = () => {
      if (!this.isRendering) return;

      this.draw(analyser, dataArray);
      this.animationId = requestAnimationFrame(render);
    };

    render();
  }

  /**
   * Draw waveform visualization
   */
  draw(analyser, dataArray) {
    // Get frequency data instead of time domain
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Calculate bar dimensions
    const barCount = 32; // Number of bars to display
    const barWidth = (this.width / barCount) * 0.8; // 80% width, 20% gap
    const barSpacing = this.width / barCount;

    // Draw frequency bars (mirrored from center)
    const centerY = this.height / 2;

    for (let i = 0; i < barCount; i++) {
      // Sample from dataArray (use lower frequencies more prominently)
      const dataIndex = Math.floor(i * dataArray.length / barCount);
      const barHeight = (dataArray[dataIndex] / 255) * (this.height / 2);

      const x = i * barSpacing;

      // Draw upper bar (growing upward from center)
      const gradient1 = this.ctx.createLinearGradient(0, centerY, 0, 0);
      gradient1.addColorStop(0, '#22d3ee');
      gradient1.addColorStop(1, '#6366f1');
      this.ctx.fillStyle = gradient1;
      this.ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);

      // Draw lower bar (growing downward from center)
      const gradient2 = this.ctx.createLinearGradient(0, centerY, 0, this.height);
      gradient2.addColorStop(0, '#22d3ee');
      gradient2.addColorStop(1, '#6366f1');
      this.ctx.fillStyle = gradient2;
      this.ctx.fillRect(x, centerY, barWidth, barHeight);
    }
  }

  /**
   * Stop rendering loop
   */
  stop() {
    this.isRendering = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
