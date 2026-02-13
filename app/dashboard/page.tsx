import { VideoList } from "@/components/video-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { videoRepository } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const videos = await videoRepository.getAllVideos();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
          <p className="text-muted-foreground">
            Manage and view processed video analyses.
          </p>
        </div>
      </div>

      <VideoList videos={videos} />
    </div>
  );
}
