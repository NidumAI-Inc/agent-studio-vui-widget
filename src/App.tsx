import { useEffect, useMemo } from "react";
import { PiChatCenteredTextBold } from "react-icons/pi";

import { endPoints } from "./utils/end-points";
import { hexToHSL } from "./utils/colors";
import useUIStore from "./store/ui";

import Wrapper from "./components/wrapper";

type props = {
  id: string // userId + _ + assistantId
  phone_number: string
  assistant_name: string
}

function App({ id, phone_number, assistant_name }: props) {
  const toggleOpen = useUIStore(s => s.toggleOpen)
  const update = useUIStore(s => s.update)
  const data = useUIStore(s => s.data)

  useEffect(() => {
    if (id && phone_number && assistant_name) {
      update({ id, phone_number, assistant_name })
    }

    async function get(id: string) {
      try {
        const response = await fetch(`${endPoints.nextbackend}/api/chat-bot?id=${id}`, {
          headers: { "Bot-Auth": id },
        })

        const res = await response.json()
        if (res) {
          update({ data: res })
        }

      } catch (error) {
        console.log(error)
      }
    }

    if (id) {
      get(id)
    }
  }, [id, phone_number, assistant_name])

  const styles = useMemo(() => {
    if (!data) return null;

    let final: any = {}
    function set(variable: string, val: string, isColor: boolean = false) {
      if (val) {
        final[variable] = isColor ? hexToHSL(val) : val
      }
    }

    set('--primary', data.background_color, true)
    set('--primary-foreground', data.text_color, true)
    set('--bot-h', data.height)
    set('--bot-w', data.width)

    return final
  }, [data])

  if (!data) return null

  return (
    <div style={styles}>
      <Wrapper />

      <button
        className="dc size-8 fixed bottom-4 right-4 rounded-full bg-primary text-primary-foreground"
        onClick={toggleOpen}
      >
        <PiChatCenteredTextBold />
      </button>
    </div>
  )
}

export default App
