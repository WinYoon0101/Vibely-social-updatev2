import CallList from "@/app/components/meeting/CallList";


const UpcomingPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Cuộc họp sắp diễn ra</h1>

      <CallList type="upcoming" />
    </section>
  );
};

export default UpcomingPage;