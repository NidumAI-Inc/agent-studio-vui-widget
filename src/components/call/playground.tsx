import { useCallback, useEffect, useMemo, useState } from "react";

import {
  TrackReferenceOrPlaceholder,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
} from "@livekit/components-react";

import {
  ConnectionState,
  LocalParticipant,
  RoomEvent,
  Track,
} from "livekit-client";

import { useMultibandTrackVolume } from "../../hooks/use-track-volume";
import useUIStore from "../../store/ui";

import AudioVisualizer from "./audio-visualizer";
import LoadingSVG from "./loading-svg";

interface PlaygroundProps {
  onConnect: (connect: boolean) => void
}

type ChatMessageType = {
  name: string
  message: string
  isSelf: boolean
  timestamp: number
}

function Playground({ onConnect }: PlaygroundProps) {
  const toggleView = useUIStore(s => s.toggleView)

  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([])
  const { localParticipant } = useLocalParticipant()

  const participants = useRemoteParticipants({
    updateOnlyOn: [RoomEvent.ParticipantMetadataChanged],
  })
  const agentParticipant = participants.find((p) => p.isAgent)

  const roomState = useConnectionState()
  const tracks = useTracks()

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true)
    }
  }, [localParticipant, roomState])

  let agentAudioTrack: TrackReferenceOrPlaceholder | undefined
  const aat = tracks.find(
    (trackRef) =>
      trackRef.publication.kind === Track.Kind.Audio &&
      trackRef.participant.isAgent
  )
  if (aat) {
    agentAudioTrack = aat
  } else if (agentParticipant) {
    agentAudioTrack = {
      participant: agentParticipant,
      source: Track.Source.Microphone,
    }
  }

  const subscribedVolumes = useMultibandTrackVolume(
    agentAudioTrack?.publication?.track,
    5
  )

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  )
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  )

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    20
  )

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        )
        let timestamp = new Date().getTime()
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp
        }
        setTranscripts([
          ...transcripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ])
      }
    },
    [transcripts]
  )

  useDataChannel(onDataReceived)

  const audioContent = useMemo(() => {
    const disconnectedContent = (
      <div className="dc flex-1 text-sm text-gray-400">
        Connect to get started
      </div>
    )

    const waitingContent = (
      <div className="dc flex-1 gap-4 text-gray-400">
        <LoadingSVG />
        <p className="text-sm">Waiting for audio track</p>
      </div>
    )

    const visualizerContent = (
      <div className="dc flex-1">
        <AudioVisualizer
          state="speaking"
          barWidth={12}
          minBarHeight={20}
          maxBarHeight={240}
          accentColor="bg-primary"
          accentShade="shadow-primary/20"
          frequencies={subscribedVolumes}
          borderRadius={6}
          gap={6}
        />
      </div>
    )

    if (roomState === ConnectionState.Disconnected) {
      return disconnectedContent
    }

    if (!agentAudioTrack) {
      return waitingContent
    }

    return visualizerContent
  }, [
    agentAudioTrack,
    subscribedVolumes,
    roomState,
  ])

  return (
    <>
      {audioContent}

      {localMicTrack && (
        <div className="dc h-[40px] mb-6">
          <AudioVisualizer
            state="speaking"
            barWidth={4}
            minBarHeight={2}
            maxBarHeight={50}
            accentColor={"bg-gray-400"}
            accentShade="shadow-gray-400"
            frequencies={localMultibandVolume}
            borderRadius={2}
            gap={4}
          />
        </div>
      )}

      <button
        onClick={() => onConnect(roomState === ConnectionState.Disconnected)}
        className={`mx-auto px-8 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${roomState === ConnectionState.Connected
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
      >
        {roomState === ConnectionState.Connected ? 'Disconnect' : 'Connect'}
      </button>

      <button
        onClick={() => toggleView("bot")}
        disabled={roomState === ConnectionState.Connected}
        className="my-2 text-[10px] text-center text-gray-500 hover:text-gray-600 cursor-pointer disabled:opacity-25"
      >
        Click here to return chat
      </button>
    </>
  )
}

export default Playground
