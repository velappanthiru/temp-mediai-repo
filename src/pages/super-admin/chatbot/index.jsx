"use client"

import ChatbotComponent from "@/components/chatbot/chatbot";
import ChatBoxLayout from "@/layout-component/chatbox-layout";
// import MainLayout from "@/layout-component/main-layout";






export default function HomePage() {

  return (
    <>
      <ChatBoxLayout>
      <ChatbotComponent />
      </ChatBoxLayout>
    </>
  );
}
