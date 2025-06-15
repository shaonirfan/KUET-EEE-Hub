"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, FileText, PlaySquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { useChat } from "@/components/hooks/use-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function ExpandableChatDemo() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    sendMessage(input)
    setInput("")
  }

  const handleAttachFile = () => {
    // Implement file attachment
  }

  const handleMicrophoneClick = () => {
    // Implement voice input
  }

  const renderMessageContent = (message: any) => {
    if (message.type === 'resource' && message.data?.resources) {
      return (
        <div className="space-y-2">
          <p>{message.content}</p>
          <div className="grid gap-2">
            {message.data.resources.map((resource: any) => (
              <Card key={resource.id} className="p-2">
                <CardHeader className="p-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{resource.name}</CardTitle>
                    <Badge variant="secondary">{resource.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{resource.courseName}</span>
                    <span>•</span>
                    <span>{resource.teacherName}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={resource.viewUrl} target="_blank">
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={resource.downloadUrl} target="_blank">
                        Download
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === 'video' && message.data?.videos) {
      return (
        <div className="space-y-2">
          <p>{message.content}</p>
          <div className="grid gap-2">
            {message.data.videos.map((video: any) => (
              <Card key={video.id} className="p-2">
                <CardHeader className="p-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{video.title}</CardTitle>
                    <Badge variant="secondary">{video.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PlaySquare className="h-4 w-4" />
                    <span>{video.courseName}</span>
                    <span>•</span>
                    <span>{video.teacherName}</span>
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link 
                        href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                        target="_blank"
                      >
                        Watch on YouTube
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === 'text' && message.sender === 'ai') {
      return <span dangerouslySetInnerHTML={{ __html: message.content }} />;
    }

    return message.content
  }

  return (
    <div className="h-[600px] relative">
      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
      >
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">KUET EEE Hub Assistant ✨</h1>
          <p className="text-sm text-muted-foreground">
            Ask me about resources and video lectures
          </p>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={
                    message.sender === "user"
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                  }
                  fallback={message.sender === "user" ? "US" : "AI"}
                />
                <ChatBubbleMessage
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  {renderMessageContent(message)}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                  fallback="AI"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          <form
            onSubmit={handleSubmit}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about resources or video lectures..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleAttachFile}
                >
                  <Paperclip className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                >
                  <Mic className="size-4" />
                </Button>
              </div>
              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  )
} 