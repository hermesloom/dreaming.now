import { IdeasProvider } from "@/context/ideas-context";
import MainApp from "@/components/main-app";

export default function Home() {
  return (
    <IdeasProvider>
      <MainApp />
    </IdeasProvider>
  );
}
