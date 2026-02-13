
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Detection } from "@/lib/repository";
import { Badge } from "@/components/ui/badge";

interface DetectionsTableProps {
    detections: Detection[];
}

export function DetectionsTable({ detections }: DetectionsTableProps) {
    // Helper to flatten detections
    const flattenedAttributes = detections.flatMap(detection => {
        const attrs = detection.attributes as Record<string, any> || {};
        return Object.entries(attrs).map(([key, value]) => ({
            pipelineId: detection.pipelineId,
            attribute: key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value),
            evidence: detection.evidence,
        }));
    });

    return (
        <div className="rounded-md border p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Attribute</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Evidence / Reasoning</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {flattenedAttributes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No detections found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        flattenedAttributes.map((item, index) => (
                            <TableRow key={`${item.pipelineId}-${index}`}>
                                <TableCell className="font-medium capitalize">{item.attribute.replace(/_/g, ' ')}</TableCell>
                                <TableCell>{item.value}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {(item.evidence as any)?.reasoning || "N/A"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
