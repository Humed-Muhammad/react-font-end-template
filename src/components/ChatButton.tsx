import { MessageCircle } from "lucide-react";

type Props = {
  unreadCount?: number;
  onClick: () => void;
};

export default function ChatButton({ unreadCount = 0, onClick }: Props) {
  return (
    <button
      aria-label="Open chat"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
    >
      <MessageCircle className="h-7 w-7" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-6 min-w-6 px-1 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
