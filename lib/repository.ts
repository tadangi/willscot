
import { videos, pipelines, detections, extractedFrames } from './db/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Video = InferSelectModel<typeof videos>;
export type NewVideo = InferInsertModel<typeof videos>;
export type Pipeline = InferSelectModel<typeof pipelines>;
export type NewPipeline = InferInsertModel<typeof pipelines>;
export type Detection = InferSelectModel<typeof detections>;
export type NewDetection = InferInsertModel<typeof detections>;
export type ExtractedFrame = InferSelectModel<typeof extractedFrames>;
export type NewExtractedFrame = InferInsertModel<typeof extractedFrames>;

export interface VideoRepository {
    createVideo(video: NewVideo): Promise<Video>;
    getVideo(id: string): Promise<Video | undefined>;
    getAllVideos(): Promise<Video[]>;
    updateVideoStatus(id: string, status: string): Promise<void>;

    createPipeline(pipeline: NewPipeline): Promise<Pipeline>;
    getPipelinesByVideoId(videoId: string): Promise<Pipeline[]>;

    createDetection(detection: NewDetection): Promise<Detection>;
    getDetectionsByPipelineId(pipelineId: string): Promise<Detection[]>;

    createExtractedFrame(frame: NewExtractedFrame): Promise<ExtractedFrame>;
    getExtractedFramesByPipelineId(pipelineId: string): Promise<ExtractedFrame[]>;
}

// Mock Implementation
export class MockVideoRepository implements VideoRepository {
    private videos: Video[] = [];
    private pipelines: Pipeline[] = [];
    private detections: Detection[] = [];
    private extractedFrames: ExtractedFrame[] = [];

    constructor() {
        // Seed some data
        const videoId = '123e4567-e89b-12d3-a456-426614174000';
        this.videos.push({
            id: videoId,
            videoUri: 's3://bucket/test-video.mp4',
            containerType: 'trailer',
            model: 'nova-2-pro',
            region: 'us-west-2',
            status: 'completed',
            createdAt: new Date(),
        });

        const pipelineId = '223e4567-e89b-12d3-a456-426614174000';
        this.pipelines.push({
            id: pipelineId,
            videoId: videoId,
            pipelineName: 'roof_assembly',
            error: null,
            selectedFrames: [10, 20, 30],
            frameRate: 30,
            createdAt: new Date(),
        });

        this.detections.push({
            id: '323e4567-e89b-12d3-a456-426614174000',
            pipelineId: pipelineId,
            videoUri: 's3://bucket/test-video.mp4',
            attributes: { condition: 'good', material: 'metal' },
            evidence: { confidence: 0.95 },
            createdAt: new Date(),
        });

        this.extractedFrames.push({
            id: '423e4567-e89b-12d3-a456-426614174000',
            pipelineId: pipelineId,
            framePath: 'https://via.placeholder.com/150',
            frameNumber: 10,
            createdAt: new Date(),
        });
    }

    async createVideo(video: NewVideo): Promise<Video> {
        const newVideo = { ...video, id: crypto.randomUUID(), createdAt: new Date() };
        this.videos.push(newVideo as Video);
        return newVideo as Video;
    }

    async getVideo(id: string): Promise<Video | undefined> {
        return this.videos.find((v) => v.id === id);
    }

    async getAllVideos(): Promise<Video[]> {
        return [...this.videos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async updateVideoStatus(id: string, status: string): Promise<void> {
        const video = this.videos.find(v => v.id === id);
        if (video) {
            video.status = status;
        }
    }

    async createPipeline(pipeline: NewPipeline): Promise<Pipeline> {
        const newPipeline = { ...pipeline, id: crypto.randomUUID(), createdAt: new Date() };
        this.pipelines.push(newPipeline as Pipeline);
        return newPipeline as Pipeline;
    }

    async getPipelinesByVideoId(videoId: string): Promise<Pipeline[]> {
        return this.pipelines.filter((p) => p.videoId === videoId);
    }

    async createDetection(detection: NewDetection): Promise<Detection> {
        const newDetection = { ...detection, id: crypto.randomUUID(), createdAt: new Date() };
        this.detections.push(newDetection as Detection);
        return newDetection as Detection;
    }

    async getDetectionsByPipelineId(pipelineId: string): Promise<Detection[]> {
        return this.detections.filter((d) => d.pipelineId === pipelineId);
    }

    async createExtractedFrame(frame: NewExtractedFrame): Promise<ExtractedFrame> {
        const newFrame = { ...frame, id: crypto.randomUUID(), createdAt: new Date() };
        this.extractedFrames.push(newFrame as ExtractedFrame);
        return newFrame as ExtractedFrame;
    }

    async getExtractedFramesByPipelineId(pipelineId: string): Promise<ExtractedFrame[]> {
        return this.extractedFrames.filter(f => f.pipelineId === pipelineId);
    }
}

// Singleton instance
export const videoRepository = new MockVideoRepository();
