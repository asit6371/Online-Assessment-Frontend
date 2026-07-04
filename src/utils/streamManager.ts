// Stream manager — stores the active camera/mic stream in memory only.
// Never recorded, never uploaded, never stored in DB or localStorage.
// Auto-cleared when the browser tab closes.

let activeStream: MediaStream | null = null;

export const setStream = (stream: MediaStream): void => {
activeStream = stream;
};

export const getStream = (): MediaStream | null => {
return activeStream;
};

export const stopStream = (): void => {
if (activeStream) {
activeStream.getTracks().forEach((track) => track.stop());
activeStream = null;
}
};