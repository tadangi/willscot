
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "@/lib/repository";
import { Badge } from "@/components/ui/badge";

interface VideoInfoCardProps {
    video: Video;
}

export function VideoInfoCard({ video }: VideoInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Video Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Video URI</span>
                    <span className="text-sm font-mono break-all">{video.videoUri}</span>
                </div>
                <div className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <div>
                        <Badge
                            variant={
                                video.status === "completed"
                                    ? "default"
                                    : video.status === "failed"
                                        ? "destructive"
                                        : "secondary"
                            }
                        >
                            {video.status}
                        </Badge>
                    </div>
                </div>
                <div className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Container Type</span>
                    <span className="text-sm">{video.containerType}</span>
                </div>
                <div className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Model</span>
                    <span className="text-sm">{video.model}</span>
                </div>
                <div className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Region</span>
                    <span className="text-sm">{video.region}</span>
                </div>
                <div className="grid gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Created At</span>
                    <span className="text-sm">{new Date(video.createdAt).toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
