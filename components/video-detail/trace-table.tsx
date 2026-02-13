
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pipeline } from "@/lib/repository";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface PipelineTraceTableProps {
    pipelines: Pipeline[];
}

export function PipelineTraceTable({ pipelines }: PipelineTraceTableProps) {
    return (
        <div className="rounded-md border p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pipeline Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Selected Frames</TableHead>
                        <TableHead>Frame Rate</TableHead>
                        <TableHead>Error</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pipelines.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No pipeline traces found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        pipelines.map((pipeline) => {
                            const isSuccess = !pipeline.error;
                            return (
                                <TableRow key={pipeline.id}>
                                    <TableCell className="font-medium">{pipeline.pipelineName}</TableCell>
                                    <TableCell>
                                        <Badge variant={isSuccess ? "default" : "destructive"}>
                                            {isSuccess ? "Success" : "Failed"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(pipeline.selectedFrames)
                                            ? (pipeline.selectedFrames as number[]).join(", ")
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{pipeline.frameRate || "-"}</TableCell>
                                    <TableCell className="text-destructive">
                                        {pipeline.error && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{pipeline.error}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
