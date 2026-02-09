import Chat from "./components/ChatContainer";

export default function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full items-center flex-col">
        <Chat />
      </main>
    </div>
  );
}
