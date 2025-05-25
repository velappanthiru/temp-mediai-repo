"use client"

import ChatBoxLayout from "@/layout-component/chatbox-layout";
import ChatbotComponent from "../../components/chatbot/chatbot";




export default function HomePage() {

  return (
    <>
      <ChatBoxLayout>
      <ChatbotComponent />
      </ChatBoxLayout>
    </>
  );
}
