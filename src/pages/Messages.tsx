import dynamic from 'next/dynamic';

import { MessagesSkeleton } from '@/components/chat/MessagesSkeleton';

// Dynamically import the Messages page content with SSR disabled.
// The chat page requires browser-only APIs: Socket.IO, cookies, window.
// Next.js dynamic import with ssr:false ensures this code only runs in the browser.
const MessagesPageContent = dynamic(
  () => import('@/components/chat/MessagesPageContent'),
  {
    ssr: false,
    loading: () => <MessagesSkeleton />,
  }
);

const MessagesPage = () => {
  return <MessagesPageContent />;
};

export default MessagesPage;
