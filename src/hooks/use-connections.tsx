import { createContext, useState, useCallback, useContext, ReactNode } from "react";
import { endPoints } from "../utils/end-points";
import useUIStore from "../store/ui";

type ConnectionData = {
  shouldConnect: boolean
  wsUrl: string
  token: string
  connect: () => Promise<void>
  disconnect: () => void
}

const ConnectionContext = createContext<ConnectionData | undefined>(undefined)

type detailsT = {
  wsUrl: string
  token: string
  shouldConnect: boolean
}

type props = {
  children: ReactNode
}

export const ConnectionProvider = ({ children }: props) => {
  const phone_number = useUIStore(s => s.phone_number)
  const id = useUIStore(s => s.id)

  const [connectionDetails, setConnectionDetails] = useState<detailsT>({
    wsUrl: "",
    token: "",
    shouldConnect: false,
  })

  const connect = useCallback(async () => {
    const url = import.meta.env.VITE_API_LIVEKIT_URL || ""
    const { accessToken } = await fetch(
      `${endPoints.mlBackend}/generate-token?phone=${phone_number}&id=${id}`
    ).then((res) => res.json())
    setConnectionDetails({ wsUrl: url, token: accessToken, shouldConnect: true })
  }, [id, phone_number])

  const disconnect = useCallback(() => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }))
  }, [])

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => {
  const context = useContext(ConnectionContext)
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider")
  }
  return context
}
