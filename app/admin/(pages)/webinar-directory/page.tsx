import WebinarDirectoryTab from "@/app/admin/(pages)/webinar-directory/_components/webinar-directory-tab";
import WebinarHead from "@/app/admin/(pages)/webinar-directory/_components/webinar-head";
import WebinarList from "@/app/admin/(pages)/webinar-directory/_components/webinar-list";

const page = () => {
  return (
    <div className="space-y-6">
      <WebinarHead />
      <WebinarDirectoryTab />
      <WebinarList />
    </div>
  );
};

export default page;
