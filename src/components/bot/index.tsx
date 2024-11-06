import { useEffect, useRef, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { nanoid } from 'nanoid';

import { endPoints } from "../../utils/end-points";
import useUIStore from "../../store/ui";

import BotLoading from "./bot-loading";
import UserQuery from "./user-query";
import BotReply from "./bot-reply";

type msgT = {
  id: string
  role: "user" | "assistant" | "loading"
  content: string
}

function Bot() {
  const [messages, setMessages] = useState<msgT[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [chat_id] = useState(nanoid(10))

  const system_prompt = useUIStore(s => s.data?.system_prompt || "")
  const rag_enabled = useUIStore(s => s.data?.rag_enabled || false)
  const id = useUIStore(s => s.id)

  const scrollableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollableRef?.current?.scrollIntoView({ behavior: "instant", block: "end" })
  }, [messages.length])

  const postData = async (msg: string) => {
    try {
      if (!msg) return;
      setMessage('')
      setLoading(true)

      const user: msgT = {
        id: nanoid(8),
        role: "user",
        content: msg,
      }

      setMessages(prev => [
        ...prev,
        user
      ])

      setMessages(prev => [
        ...prev,
        {
          id: nanoid(8),
          role: "loading",
          content: "",
        }
      ])
      // setTimeout(() => {
      // }, 100)

      const dataMap = messages.map(({ id, ...rest }) => rest)
      const { id: _, ...restUserContent } = user

      const [user_id, agent_id] = id.split("_")
      let systemPrompt = system_prompt

      if (rag_enabled) {
        const response = await fetch(`${endPoints.mlBackend}/users/${user_id}/agents/${agent_id}/retrieve/?query=${msg}&retrieval_len=5`, {
          cache: "no-store",
        })
        const res = await response.json()
        const txts = res?.results?.[1]?.join(" ")
        systemPrompt = systemPrompt + " Information: " + txts
      }

      const chat = [
        {
          role: "system",
          content: systemPrompt
        },
        ...dataMap,
        restUserContent,
      ]

      const payload: any = {
        agent_id,
        user_id,
        chat_id,
        chat,
      }

      const headers: any = {
        "content-type": "application/json",
      }

      const url = `${endPoints.mlBackend}/chat`

      const response = await fetch(url, {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(payload),
        headers,
      })

      const reply = await response.json()

      const botRes = reply?.response || ""
      setLoading(false)
      const botReply: msgT = {
        role: "assistant",
        content: botRes,
        id: nanoid(8),
      }
      setMessages(prev => {
        let len = prev.length - 1
        let last = prev[len]
        if (last.role === "assistant" || last.role === "loading") {
          const filtered = prev.filter((p, i) => i < len)
          return [...filtered, botReply]
        }

        return prev
      })

      // const reader = response.body?.getReader()
      // let botRes = ""
      // reader?.read().then(function processResult(result: any): any {
      //   try {
      //     if (result.done) {
      //       // console.log("at done")
      //       // const botReply: msgT = {
      //       //   role: "assistant",
      //       //   content: botRes,
      //       //   id: nanoid(8),
      //       // }
      //       // setLoading(false)
      //       // setMessages(prev => prev.map(p => {
      //       //   if (p.role === "assistant" || p.role === "loading") {
      //       //     return botReply
      //       //   }
      //       //   return p
      //       // }))
      //       return;
      //     }

      //     const decoded = new TextDecoder().decode(result.value)
      //     const resArr = decoded?.split("data: ")

      //     for (const res of resArr) {
      //       if (res && res !== "[DONE]") {
      //         const json = JSON?.parse(res)
      //         // console.log(json)
      //         let text = json?.choices?.[0]?.delta?.content || ""
      //         let finishReason = json?.choices?.[0]?.finish_reason || ""

      //         const hasFinishReason = ["stop", "length"].includes(finishReason)
      //         if (json?.error && !text) {
      //           setLoading(false)
      //           return
      //         }
      //         botRes += text

      //         if (hasFinishReason) {
      //           console.log("at finish")
      //           const botReply: msgT = {
      //             role: "assistant",
      //             content: botRes,
      //             id: nanoid(8),
      //           }
      //           setLoading(false)
      //           setMessages(prev => {
      //             let len = prev.length - 1
      //             let last = prev[len]
      //             if (last.role === "assistant" || last.role === "loading") {
      //               const filtered = prev.filter((p, i) => i < len)
      //               return [...filtered, botReply]
      //             }

      //             return prev
      //           })
      //           return;
      //         }

      //         // console.log("at bot")
      //         const botReply: msgT = {
      //           role: "assistant",
      //           content: botRes,
      //           id: nanoid(8),
      //         }

      //         setMessages(prev => {
      //           let len = prev.length - 1
      //           let last = prev[len]
      //           if (last.role === "assistant" || last.role === "loading") {
      //             const filtered = prev.filter((p, i) => i < len)
      //             return [...filtered, botReply]
      //           }

      //           return prev
      //         })
      //       }
      //     }

      //     return reader.read().then(processResult)

      //   } catch (error) { }
      // })

    } catch (error) {
      console.log(error)
    }
  }

  const sentMessage = () => {
    if (message) {
      postData(message)
    }
  }

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      sentMessage()
    }
  }

  return (
    <>
      <div className='scroll-y px-3 py-4'>
        {
          messages.map(msg => {
            if (msg.role === "loading") return (
              <BotLoading key={msg.id} />
            )

            if (msg.role === "user") return (
              <UserQuery
                key={msg.id}
                content={msg.content}
              />
            )

            return (
              <BotReply
                key={msg.id}
                content={msg.content}
              />
            )
          })
        }
        <div ref={scrollableRef} className="py-2"></div>
      </div>

      <div className='df py-1 mb-0.5 border-t'>
        <input
          type="text"
          className='w-full py-1.5 pl-3 text-xs text-black border-none shadow-none'
          placeholder="Enter your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={keyPress}
          disabled={loading}
        />

        <button
          className="dc p-1 mr-1 text-xs rounded-full hover:bg-primary/40 transition-colors text-black"
          disabled={loading}
        >
          <LuSendHorizonal />
        </button>
      </div>
    </>
  )
}

export default Bot
