import BotLogo from "../common/bot-logo";

function BotLoading() {
  return (
    <div className="df gap-1.5 items-start mb-4 text-black">
      <BotLogo />

      <div className="max-w-[90%] w-fit px-2.5 py-1.5 text-xs rounded-xl rounded-tl-none border">
        <span className="text-xs">Thinking</span>
        <span className="animate-ping text-xl leading-3">.</span>
        <span className="animate-ping delay-75 text-xl leading-3">.</span>
        <span className="animate-ping delay-100 text-xl leading-3">.</span>
      </div>
    </div>
  )
}

export default BotLoading
