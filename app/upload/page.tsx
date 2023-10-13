import UploadForm from "@/components/upload-form";
import prisma from "@/lib/prisma";

async function getMissions() {
  return await prisma.mission.findMany();
}

export default async function UploadPage() {
  const missions = await getMissions();

  return (
    <>
      <div className="container my-10">
        <div className="max-w-2xl mx-auto">
          <UploadForm missions={missions} />
        </div>
      </div>
    </>
  );
}
