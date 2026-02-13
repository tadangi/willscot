-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "video_uri" TEXT NOT NULL,
    "container_type" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'us-west-2',
    "status" TEXT NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "pipeline_name" TEXT NOT NULL,
    "error" TEXT,
    "selected_frames" JSONB,
    "frame_rate" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detections" (
    "id" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "video_uri" TEXT NOT NULL,
    "attributes" JSONB,
    "evidence" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracted_frames" (
    "id" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "frame_path" TEXT NOT NULL,
    "frame_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extracted_frames_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detections" ADD CONSTRAINT "detections_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_frames" ADD CONSTRAINT "extracted_frames_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
