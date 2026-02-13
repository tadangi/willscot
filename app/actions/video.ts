
'use server';

import { videoRepository } from '@/lib/repository';
import { revalidatePath } from 'next/cache';

const LAMBDA_ENDPOINT = process.env.LAMBDA_ENDPOINT || 'https://mock-lambda.com';

interface PipelineResult {
    pipeline_name: string;
    error: string | null;
    selected_frames: number[];
    frame_rate: number;
    extracted_images: string[];
    final_json: {
        videoAttributes: any;
    };
    step2_json: {
        reasoning: string;
    };
}

interface LambdaResponse {
    pipelines: PipelineResult[];
    error?: string;
}

export async function processVideo(formData: FormData) {
    const videoUri = formData.get('video_uri') as string;
    const containerType = formData.get('container_type') as string;
    const model = formData.get('model') as string;
    const region = formData.get('region') as string || 'us-west-2';

    // 1. Create Video Record (Pending)
    const video = await videoRepository.createVideo({
        videoUri,
        containerType,
        model: model,
        region,
        status: 'processing',
    });

    revalidatePath('/dashboard');

    try {
        // 2. Call Lambda
        // Note: In a real scenario, this might be a long-running process better handled by a queue
        // or by updating status asynchronously. For this prototype, we'll await it (or mock it).

        let result: LambdaResponse;

        if (process.env.LAMBDA_ENDPOINT) {
            const response = await fetch(LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_uri: videoUri,
                    container_type: containerType,
                    model: model,
                    region: region,
                }),
            });

            if (!response.ok) {
                throw new Error(`Lambda failed: ${response.statusText}`);
            }
            result = await response.json();
        } else {
            // Mock Lambda Response
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
            result = {
                pipelines: [
                    {
                        pipeline_name: 'roof_assembly',
                        error: null,
                        selected_frames: [120, 150, 180],
                        frame_rate: 30,
                        extracted_images: ['https://placehold.co/300x200/png?text=Roof+Frame+120'],
                        final_json: {
                            videoAttributes: {
                                condition: 'Excellent',
                                material: 'Aluminum',
                                damages: 'None'
                            }
                        },
                        step2_json: { reasoning: 'Clear view of roof' }
                    },
                    {
                        pipeline_name: 'interior_assembly',
                        error: null,
                        selected_frames: [400, 450],
                        frame_rate: 30,
                        extracted_images: ['https://placehold.co/300x200/png?text=Interior+Frame+400'],
                        final_json: {
                            videoAttributes: {
                                flooring: 'Vinyl',
                                walls: 'Painted',
                                cleanliness: 'Clean'
                            }
                        },
                        step2_json: { reasoning: 'Interior walkthrough' }
                    }
                ]
            };
        }

        // 3. Store Results
        for (const pipelineData of result.pipelines) {
            const pipeline = await videoRepository.createPipeline({
                videoId: video.id,
                pipelineName: pipelineData.pipeline_name,
                error: pipelineData.error,
                selectedFrames: pipelineData.selected_frames,
                frameRate: pipelineData.frame_rate,
            });

            if (!pipelineData.error) {
                await videoRepository.createDetection({
                    pipelineId: pipeline.id,
                    videoUri: videoUri,
                    attributes: pipelineData.final_json.videoAttributes,
                    evidence: pipelineData.step2_json,
                });

                for (const imagePath of pipelineData.extracted_images) {
                    await videoRepository.createExtractedFrame({
                        pipelineId: pipeline.id,
                        framePath: imagePath,
                        frameNumber: 0, // We might need to map this if available
                    });
                }
            }
        }

        await videoRepository.updateVideoStatus(video.id, 'completed');
        revalidatePath('/dashboard');
        return { success: true, videoId: video.id };

    } catch (error) {
        console.error('Processing failed:', error);
        await videoRepository.updateVideoStatus(video.id, 'failed');
        revalidatePath('/dashboard');
        return { success: false, error: 'Processing failed' };
    }
}
