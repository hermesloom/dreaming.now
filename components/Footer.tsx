import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center">
        <div className="flex items-center gap-4 text-xs text-gray-500 ml-auto">
          <Link
            href="https://github.com/hermesloom/dreaming.now"
            className="hover:underline flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={12} />
            GitHub
          </Link>
          <Link
            href="https://discord.gg/4ArHzm3E"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </Link>
          <Link
            href="https://divizend.com/imprint"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Imprint
          </Link>
          <Link
            href="https://divizend.com/data-protection"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data Protection
          </Link>
        </div>
      </div>
    </footer>
  );
}
