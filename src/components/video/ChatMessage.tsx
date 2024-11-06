import cn from "../../utils/cn";

type ChatMessageProps = {
  message: string;
  accentColor: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};

export const ChatMessage = ({
  name,
  message,
  accentColor,
  isSelf,
  hideName,
}: ChatMessageProps) => {
  return (
    <div
      className={cn("df w-fit max-w-[90%] mb-4 text-xs", {
        "ml-auto px-3 py-1.5 font-medium bg-slate-50 text-slate-800 rounded-xl": isSelf,
        "text-zinc-900": !isSelf
      })}
    >
      {message}
    </div>
  );
};
