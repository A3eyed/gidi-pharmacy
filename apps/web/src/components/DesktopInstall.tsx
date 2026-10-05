'use client';

import { useEffect, useState } from 'react';

/**
 * Registers the offline cache and offers a desktop install on laptop browsers.
 * Installed mode is the pharmacy counter app: no browser chrome, last data kept.
 */
export default function DesktopInstall() {
  const [offline, setOffline] = useState(false);
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    setOffline(!navigator.onLine);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('beforeinstallprompt', onPrompt);
    };
  }, []);

  return (
    <>
      {offline ? (
        <div className="fixed inset-x-0 top-0 z-50 bg-black px-4 py-2 text-center text-xs text-white">
          Offline. GiDi is showing the last inventory, sales and Azara replies saved on this computer.
        </div>
      ) : null}
      {prompt ? (
        <button
          type="button"
          onClick={async () => {
            prompt.prompt();
            setPrompt(null);
          }}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-black px-4 py-2 text-sm text-white"
        >
          Install GiDi for this computer
        </button>
      ) : null}
    </>
  );
}
