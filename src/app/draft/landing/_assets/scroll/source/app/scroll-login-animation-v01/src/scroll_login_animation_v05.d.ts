export type ScrollState = "closed" | "opening" | "open" | "closing" | "scrubbing";
export type ScrollView = "front" | "elevated" | "perspective" | "side";

export interface ScrollAnimationOptions {
  onReady?: () => void;
  onError?: (error: unknown) => void;
  onProgress?: (progress: number, state: ScrollState) => void;
  onStateChange?: (state: ScrollState) => void;
  onFormState?: (active: boolean) => void;
}

export class ScrollLoginAnimation {
  constructor(container: HTMLElement, options?: ScrollAnimationOptions);
  progress: number;
  state: ScrollState;
  init(): Promise<this>;
  playOpen(): void;
  playClose(): void;
  reverse(): void;
  setProgress(value: number): void;
  setTiming(openDuration: number, closeDuration?: number): void;
  setView(view: ScrollView): void;
  getMetrics(): { triangles: number; drawCalls: number; progress: number; state: ScrollState };
  dispose(): void;
}

declare global {
  interface Window {
    __SCENE_READY__?: boolean;
    __seek?: (value: number) => void;
    scrollLoginAnimation?: ScrollLoginAnimation;
  }
}
