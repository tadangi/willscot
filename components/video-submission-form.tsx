
'use client';

import { useTransition } from "react";
import { processVideo } from "@/app/actions/video";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function VideoSubmissionForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await processVideo(formData);
            if (result.success) {
                router.push(`/dashboard/${result.videoId}`);
            } else {
                // Handle error (could use toast here)
                alert("Failed to process video");
            }
        });
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Process New Video</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="video_uri">Video URI (S3)</Label>
                        <Input
                            id="video_uri"
                            name="video_uri"
                            placeholder="s3://bucket/path/to/video.mp4"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="container_type">Container Type</Label>
                        <Select name="container_type" defaultValue="trailer">
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="trailer">Trailer</SelectItem>
                                <SelectItem value="container">Container</SelectItem>
                                <SelectItem value="flex">Flex</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Select name="model" defaultValue="nova-2-pro">
                            <SelectTrigger>
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nova-2-pro">Nova-2-Pro</SelectItem>
                                <SelectItem value="nova-2-omni">Nova-2-Omni</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Input
                            id="region"
                            name="region"
                            defaultValue="us-west-2"
                            readOnly
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </>
                        ) : (
                            "Start Processing"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
