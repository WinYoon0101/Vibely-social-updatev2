import StreamVideoProvider from '@/providers/StreamClientProvider';
import SidebarMeet from '../components/SidebarMeet';
import "@stream-io/video-react-sdk/dist/css/styles.css";


const RootLayout = ({ children }) => {
  return (
    <main className="relative">
       <StreamVideoProvider>
      <div className="flex">
        <SidebarMeet />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14 bg-[#e2f2fa]">
          <div className="w-full">{children}</div>
        </section>
      </div>
      </StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
