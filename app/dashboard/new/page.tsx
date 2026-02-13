
import { VideoSubmissionForm } from "@/components/video-submission-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewVideoPage() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            <div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4 pl-0 hover:pl-0 hover:bg-transparent">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">New Video Analysis</h1>
            </div>

            <VideoSubmissionForm />
        </div>
    );
}
