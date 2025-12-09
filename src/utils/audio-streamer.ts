export class AudioStreamer {
  private context: AudioContext;
  private sampleRate: number;
  private nextStartTime: number = 0;
  private isPlaying: boolean = false;
  private onComplete: () => void;

  constructor({ sampleRate = 24000, onComplete }: { sampleRate?: number, onComplete: () => void }) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass({ sampleRate });
    this.sampleRate = sampleRate;
    this.onComplete = onComplete;
  }

  addPCM16(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const buffer = this.context.createBuffer(1, float32.length, this.sampleRate);
    buffer.copyToChannel(float32, 0);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);

    const currentTime = this.context.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }
    
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.isPlaying = true;

    source.onended = () => {
        if (this.context.currentTime >= this.nextStartTime) {
            this.isPlaying = false;
            this.onComplete();
        }
    };
  }

  stop() {
    this.context.close();
    // Recrear contexto para futura conexión
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass({ sampleRate: this.sampleRate });
    this.nextStartTime = 0;
    this.isPlaying = false;
  }
}
