// import { useEffect, useRef } from "react";
import { ChatMessage as ComponentsChatMessage } from "@livekit/components-react";

// import { ChatMessageInput } from "./ChatMessageInput";
import { ChatMessage } from "./ChatMessage";

// const inputHeight = 48;

export type ChatMessageType = {
  name: string;
  message: string;
  isSelf: boolean;
  timestamp: number;
};

type ChatTileProps = {
  messages: ChatMessageType[];
  accentColor: string;
  onSend?: (message: string) => Promise<ComponentsChatMessage>;
};

export const ChatTile = ({ messages, accentColor, onSend }: ChatTileProps) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight;
  //   }
  // }, [containerRef, messages]);

  return (
    <>
      {messages.map((message, index, allMsg) => {
        const hideName =
          index >= 1 && allMsg[index - 1].name === message.name;

        return (
          <ChatMessage
            key={index}
            hideName={hideName}
            name={message.name}
            message={message.message}
            isSelf={message.isSelf}
            accentColor={accentColor}
          />
        );
      })}
    </>
  );
};
