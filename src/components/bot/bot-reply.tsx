import MarkdownParse from "./markdown-parse";
import BotLogo from '../common/bot-logo';

type props = {
  content: string
}

function BotReply({ content }: props) {
  return (
    <div className="df gap-1.5 items-start mb-4">
      <BotLogo />

      <div className="max-w-[80%] w-fit mt-0.5 px-2.5 py-1.5 text-xs rounded-xl rounded-tl-none border">
        <MarkdownParse response={content} />
      </div>
    </div>
  )
}

export default BotReply
