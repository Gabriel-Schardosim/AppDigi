declare module 'react-native-base64' {
  export function encode(input: string): string;
  export function decode(base64: string): string;
  export function encodeFromByteArray(input: Uint8Array): string;
  export function decodeToByteArray(base64: string): Uint8Array;
}
