
import { videoRepository } from "@/lib/repository";
import { notFound } from "next/navigation";
import { VideoInfoCard } from "@/components/video-detail/info-card";
import { PipelineTraceTable } from "@/components/video-detail/trace-table";
import { FramesPreview } from "@/components/video-detail/frames-preview";
import { DetectionsTable } from "@/components/video-detail/detections-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoDetailPageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
    const { id } = await params;
    const video = await videoRepository.getVideo(id);

    if (!video) {
        notFound();
    }

    const pipelines = await videoRepository.getPipelinesByVideoId(id);

    // Consolidate detections and frames from all pipelines
    const allDetections = (await Promise.all(
        pipelines.map(p => videoRepository.getDetectionsByPipelineId(p.id))
    )).flat();

    const allFrames = (await Promise.all(
        pipelines.map(p => videoRepository.getExtractedFramesByPipelineId(p.id))
    )).flat();

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4 pl-0 hover:pl-0 hover:bg-transparent">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Video Analysis Details</h1>
            </div>

            <VideoInfoCard video={video} />

            <Tabs defaultValue="trace" className="w-full">
                <TabsList>
                    <TabsTrigger value="trace">Pipeline Trace</TabsTrigger>
                    <TabsTrigger value="detections">Object Detections</TabsTrigger>
                    <TabsTrigger value="frames">Extracted Frames</TabsTrigger>
                </TabsList>
                <TabsContent value="trace" className="space-y-4">
                    <h3 className="text-lg font-semibold mt-4">Pipeline Execution Trace</h3>
                    <PipelineTraceTable pipelines={pipelines} />
                </TabsContent>
                <TabsContent value="detections" className="space-y-4">
                    <h3 className="text-lg font-semibold mt-4">Detected Attributes</h3>
                    <DetectionsTable detections={allDetections} />
                </TabsContent>
                <TabsContent value="frames" className="space-y-4">
                    <h3 className="text-lg font-semibold mt-4">Extracted Frames</h3>
                    <FramesPreview frames={allFrames} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
