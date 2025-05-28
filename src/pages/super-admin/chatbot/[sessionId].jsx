"use client"

import ChatBoxLayout from "@/layout-component/chatbox-layout";
import { useRouter } from "next/router";
export default function HomePage() {
  const router = useRouter();
  const sessionId = router.query.sessionId;
  return (
    <>
      <ChatBoxLayout sessionId={sessionId}>
      </ChatBoxLayout>
    </>
  );
}
