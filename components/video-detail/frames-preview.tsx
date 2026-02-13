
import { ExtractedFrame } from "@/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";

interface FramesPreviewProps {
    frames: ExtractedFrame[];
}

export function FramesPreview({ frames }: FramesPreviewProps) {
    if (frames.length === 0) {
        return <div className="text-muted-foreground text-sm">No extracted frames available.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {frames.map((frame) => (
                <Dialog key={frame.id}>
                    <DialogTrigger asChild>
                        <Card className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <CardContent className="p-0 relative aspect-video">
                                <Image
                                    src={frame.framePath}
                                    alt={`Frame ${frame.frameNumber}`}
                                    fill
                                    className="object-cover"
                                    unoptimized // For external URLs in demo
                                />
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                        <DialogTitle className="sr-only">Frame {frame.frameNumber}</DialogTitle>
                        <div className="sr-only" aria-describedby={undefined}>
                            Dialog displaying frame {frame.frameNumber}
                        </div>
                        <div className="relative aspect-video w-full h-[80vh]">
                            <Image
                                src={frame.framePath}
                                alt={`Frame ${frame.frameNumber}`}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    );
}
