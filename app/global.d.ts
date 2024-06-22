declare global {
  interface WebSocket {
    addEventListener(
      type: "message",
      listener: (event: { data: MessageEvent<WsMessage> }) => void,
    ): void;
  }
}
