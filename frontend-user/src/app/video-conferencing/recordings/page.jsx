
import CallList from "@/app/components/meeting/CallList";

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10">
      <h1 className="text-3xl font-bold">Bản ghi cuộc họp</h1>

      <CallList type="recordings" />
    </section>
  );
};

export default PreviousPage;