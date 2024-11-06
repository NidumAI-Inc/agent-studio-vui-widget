import { useCallback, useEffect, useMemo, useState } from "react";

import { TranscriptionTile } from "./transcription-tile";
import { ChatMessageType } from "./chat-tile";
import LoadingSVG from "./loading-svg";

import { ConfigurationPanelItem } from "./ConfigurationPanelItem";

import {
  VideoTrack,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import useUIStore from "../../store/ui";
import { PiChatCenteredTextBold } from "react-icons/pi";

interface PlaygroundProps {
  onConnect: (connect: boolean) => void
}

function Playground({ onConnect }: PlaygroundProps) {
  const toggleView = useUIStore(s => s.toggleView)

  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();

  const voiceAssistant = useVoiceAssistant();

  const roomState = useConnectionState();
  const tracks = useTracks();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setCameraEnabled(true);
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const agentVideoTrack = tracks.find(
    (trackRef) =>
      trackRef.publication.kind === Track.Kind.Video &&
      trackRef.participant.isAgent
  );

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localVideoTrack = localTracks.find(
    ({ source }) => source === Track.Source.Camera
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        setTranscripts([
          ...transcripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [transcripts]
  );

  useDataChannel(onDataReceived);

  // const videoTileContent = useMemo(() => {
  //   const videoFitClassName = `object-cover`;

  //   const disconnectedContent = (
  //     <div className="flex items-center justify-center text-gray-700 text-center w-full h-full">
  //       No video track. Connect to get started.
  //     </div>
  //   );

  //   const loadingContent = (
  //     <div className="flex flex-col items-center justify-center gap-2 text-gray-700 text-center h-full w-full">
  //       <LoadingSVG />
  //       Waiting for video track
  //     </div>
  //   );

  //   const videoContent = (
  //     <VideoTrack
  //       trackRef={agentVideoTrack}
  //       className={` ${videoFitClassName} object-position-center w-full h-full`}
  //     />
  //   );

  //   let content = null;
  //   if (roomState === ConnectionState.Disconnected) {
  //     content = disconnectedContent;
  //   } else if (agentVideoTrack) {
  //     content = videoContent;
  //   } else {
  //     content = loadingContent;
  //   }

  //   return (
  //     <div className="scroll-y relative">
  //       {content}
  //     </div>
  //   );
  // }, [agentVideoTrack, roomState]);

  // const audioTileContent = useMemo(() => {
  //   const disconnectedContent = (
  //     <div className="flex flex-col items-center justify-center gap-2 text-gray-700 text-center w-full">
  //       No audio track. Connect to get started.
  //     </div>
  //   );

  //   const waitingContent = (
  //     <div className="flex flex-col items-center gap-2 text-gray-700 text-center w-full">
  //       <LoadingSVG />
  //       Waiting for audio track
  //     </div>
  //   );

  //   const visualizerContent = (
  //     <div
  //       className={`flex items-center justify-center w-full h-48 [--lk-va-bar-width:30px] [--lk-va-bar-gap:20px] [--lk-fg:var(--lk-theme-color)]`}
  //     >
  //       <BarVisualizer
  //         state={voiceAssistant.state}
  //         trackRef={voiceAssistant.audioTrack}
  //         barCount={5}
  //         options={{ minHeight: 20 }}
  //       />
  //     </div>
  //   );

  //   if (roomState === ConnectionState.Disconnected) {
  //     return disconnectedContent;
  //   }

  //   if (!voiceAssistant.audioTrack) {
  //     return waitingContent;
  //   }

  //   return visualizerContent;
  // }, [
  //   voiceAssistant.audioTrack,
  //   // config.settings.theme_color,
  //   roomState,
  //   voiceAssistant.state,
  // ]);

  const chatTileContent = useMemo(() => {
    if (voiceAssistant.audioTrack) {
      return (
        <TranscriptionTile
          agentAudioTrack={voiceAssistant.audioTrack}
          accentColor=""
        />
      );
    }
    return <></>;
  }, [voiceAssistant.audioTrack]);

  return (
    <>
      {/* {videoTileContent} */}

      {/* {audioTileContent} */}
      {localVideoTrack && (
        <ConfigurationPanelItem
          title="Camera"
          deviceSelectorKind="videoinput"
        >
          <VideoTrack
            className=" h-[50%] rounded-sm border border-gray-800 opacity-70 w-full"
            trackRef={localVideoTrack}
          />
        </ConfigurationPanelItem>
      )}

      {
        roomState === "disconnected" &&
        <div className="dc absolute inset-0 text-sm text-gray-500">
          Click connect to proceed
        </div>
      }
      <div className="scroll-y p-4">
        {chatTileContent}
      </div>

      <button
        onClick={() => onConnect(roomState === ConnectionState.Disconnected)}
        className={`px-8 py-1.5 rounded-full text-xs font-medium transition-all duration-300 absolute -top-11 right-12 ${roomState === ConnectionState.Connected
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
      >
        {roomState === ConnectionState.Connected ? 'Disconnect' : 'Connect'}
      </button>

      <button
        onClick={() => toggleView("bot")}
        disabled={roomState === ConnectionState.Connected}
        className=" absolute -top-10 right-4 text-lg text-center text-gray-500 hover:text-primary cursor-pointer disabled:opacity-25"
      >
        <PiChatCenteredTextBold />
      </button>
    </>
  )
}

export default Playground
