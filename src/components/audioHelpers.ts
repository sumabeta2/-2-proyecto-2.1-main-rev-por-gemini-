// utils/audioHelpers.ts

// Convierte Base64 a ArrayBuffer
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convierte ArrayBuffer a Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convierte Float32 (Micrófono navegador) a PCM Int16 (Gemini API)
export function float32ToInt16PCM(float32Arr: Float32Array): Int16Array {
  const int16Arr = new Int16Array(float32Arr.length);
  for (let i = 0; i < float32Arr.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Arr[i]));
    int16Arr[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Arr;
}

// Decodifica audio PCM crudo a AudioBuffer para reproducir
export async function pcmToAudioBuffer(
  pcmData: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000 // Gemini suele responder en 24kHz
): Promise<AudioBuffer> {
  const int16 = new Int16Array(pcmData.buffer);
  const float32 = new Float32Array(int16.length);
  
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }

  const buffer = ctx.createBuffer(1, float32.length, sampleRate);
  buffer.copyToChannel(float32, 0);
  return buffer;
}
