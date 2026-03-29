interface Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
    identify: (sessionData: Record<string, unknown>) => void;
  };
}
