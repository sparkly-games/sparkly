import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

export const GameFrame = ({ src, ref, style, onLoad, sandbox }: { src: string; ref: any; style: any; onLoad: any; sandbox: string }) => {
  if (Platform.OS === 'web') {
    return <iframe src={src} style={style} ref={ref} onLoad={onLoad} sandbox={sandbox} />;
  }
  return <WebView source={{ uri: src }} style={style} ref={ref} onLoad={onLoad} sandbox={sandbox} />;
};