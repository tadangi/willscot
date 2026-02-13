
import { pgTable, text, timestamp, uuid, jsonb, integer, boolean } from 'drizzle-orm/pg-core';

export const videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    videoUri: text('video_uri').notNull(),
    containerType: text('container_type').notNull(), // 'trailer' | 'container' | 'flex'
    model: text('model').notNull(), // 'nova-2-pro' | 'nova-2-omni'
    region: text('region').default('us-west-2').notNull(),
    status: text('status').default('processing').notNull(), // 'processing' | 'completed' | 'failed'
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pipelines = pgTable('pipelines', {
    id: uuid('id').primaryKey().defaultRandom(),
    videoId: uuid('video_id').references(() => videos.id).notNull(),
    pipelineName: text('pipeline_name').notNull(),
    error: text('error'),
    selectedFrames: jsonb('selected_frames'), // Array of numbers
    frameRate: integer('frame_rate'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const detections = pgTable('detections', {
    id: uuid('id').primaryKey().defaultRandom(),
    pipelineId: uuid('pipeline_id').references(() => pipelines.id).notNull(),
    videoUri: text('video_uri').notNull(),
    attributes: jsonb('attributes'), // final_json.videoAttributes
    evidence: jsonb('evidence'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const extractedFrames = pgTable('extracted_frames', {
    id: uuid('id').primaryKey().defaultRandom(),
    pipelineId: uuid('pipeline_id').references(() => pipelines.id).notNull(),
    framePath: text('frame_path').notNull(),
    frameNumber: integer('frame_number').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
