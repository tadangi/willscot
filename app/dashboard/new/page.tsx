
import { VideoSubmissionForm } from "@/components/video-submission-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewVideoPage() {
    return (
        <div className="container mx-auto py-4 space-y-4">
            <div>
                <Link href="/dashboard">
                    <Button variant="outline" size={"sm"} className="mb-4 pl-0 hover:bg-transparent">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">New Video Analysis</h1>
            </div>
            <VideoSubmissionForm />
        </div>
    );
}
