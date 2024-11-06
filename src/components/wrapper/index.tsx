import { LuPhoneCall } from "react-icons/lu";
import { BsCameraVideo } from "react-icons/bs";

import useUIStore from "../../store/ui";
import cn from "../../utils/cn";

import DataCollection from "../data-collection";
import BotLogo from "../common/bot-logo";
import Video from "../video";
import Call from "../call";
import Bot from "../bot";

let showVideo = false

function Wrapper() {
  const toggleView = useUIStore(s => s.toggleView)
  const hasDataCollection = useUIStore(s => !!s?.data?.data_collections?.length && !s.data_collected)
  const assistant_name = useUIStore(s => s.assistant_name)
  const view = useUIStore(s => s.view)
  const open = useUIStore(s => s.open)

  return (
    <section
      className={cn("dfc gap-1 h-[var(--bot-h,80vh)] w-[var(--bot-w,320px)] fixed bottom-14 right-4 shadow-outer border rounded-2xl animate-in zoom-in origin-bottom-right duration-200 overflow-y-hidden bg-white", {
        "scale-100": open,
        "scale-0": !open,
      })}
    >
      <header className='df px-3 py-2.5 border-b'>
        <div className="relative">
          <BotLogo />
          <span className="absolute size-2.5 bottom-0 right-0 rounded-full bg-green-400 border border-white"></span>
        </div>

        <div className="flex-1">
          <p className='flex-1 text-[13px] font-semibold leading-4 text-black'>{assistant_name}</p>
          <p className="text-[11px] leading-3 text-black">Active</p>
        </div>

        {
          showVideo && !hasDataCollection && view === "bot" &&
          <button onClick={() => toggleView("video")} className="mr-2 text-lg text-gray-500 hover:text-primary">
            <BsCameraVideo />
          </button>
        }

        {
          !hasDataCollection && view === "bot" &&
          <button onClick={() => toggleView("call")} className="text-gray-500 hover:text-primary">
            <LuPhoneCall />
          </button>
        }
      </header>

      {
        hasDataCollection ?
          <DataCollection />
          : <>
            {
              view === "bot" &&
              <Bot />
            }

            {
              view === "call" &&
              <Call />
            }

            {
              showVideo && view === "video" &&
              <Video />
            }
          </>
      }
    </section>
  )
}

export default Wrapper
