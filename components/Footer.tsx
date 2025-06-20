import Link from "next/link";
import { Github } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center">
        <div className="flex items-center gap-4 text-xs text-gray-500 mx-auto">
          <Image
            src="/dreaming.now.svg"
            alt="Dreaming Now Logo"
            width={70}
            height={30}
            priority
            className="mr-2"
          />
          <Link
            href="https://github.com/hermesloom/dreaming.now"
            className="hover:underline flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={12} />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
