
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Video } from "@/lib/repository";
import { Eye } from "lucide-react";

interface VideoListProps {
    videos: Video[];
}

export function VideoList({ videos }: VideoListProps) {
    return (
        <div className="rounded-md border p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Video URI</TableHead>
                        <TableHead>Container Type</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No videos found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium truncate max-w-[200px]" title={video.videoUri}>
                                    {video.videoUri.split('/').pop()}
                                </TableCell>
                                <TableCell>{video.containerType}</TableCell>
                                <TableCell>{video.model}</TableCell>
                                <TableCell>{video.region}</TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell>
                                    {new Date(video.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/${video.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
