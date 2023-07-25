import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DatabaseMongoUUIDEntityAbstract } from "src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract";
import { DatabaseEntity } from "src/common/database/decorators/database.decorator";
import {
  ENUM_CPU_MARKET_STATUS,
  ENUM_CPU_VERTICAL_SEGMENT,
} from "../../constants/cpu.enum.constant";

export const CPUDatabaseName = "cpus";
@DatabaseEntity({ collection: CPUDatabaseName })
export class CPUEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
    maxlength: 80,
    type: String,
  })
  cpuName: string;

  @Prop({
    required: true,
    maxlength: 200,
    trim: true,
    type: String,
  })
  link: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
    maxlength: 60,
    type: String,
  })
  productCollection: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
    maxlength: 100,
    type: String,
  })
  codeName: string;

  @Prop({
    index: true,
    default: ENUM_CPU_VERTICAL_SEGMENT.UNKNOWN,
    enum: ENUM_CPU_VERTICAL_SEGMENT,
  })
  verticalSegment: ENUM_CPU_VERTICAL_SEGMENT;

  @Prop({
    required: true,
    index: true,
    trim: true,
    maxlength: 100,
    lowercase: true,
    type: String,
  })
  brand: string;

  @Prop({
    required: true,
    index: true,
    maxlength: 40,
    trim: true,
    type: String,
  })
  processorNumber: string;

  @Prop({
    index: true,
    maxlength: 20,
    type: Number,
  })
  lithography?: number;

  @Prop({
    maxlength: 200,
    type: String,
  })
  processorGraphics?: string;

  @Prop({
    type: Number,
  })
  graphicsBaseFrequency?: number;

  @Prop({
    index: true,
    type: Number,
  })
  price?: number;

  @Prop({
    index: true,
    type: Number,
  })
  totalCores?: number;

  @Prop({
    index: true,
    type: Number,
  })
  totalThreads?: number;

  @Prop({
    index: true,
    type: Number,
  })
  maxTurboFrequency?: number;

  @Prop({
    index: true,
    type: Number,
  })
  processorBaseFrequency?: number;

  @Prop({
    index: true,
    type: Number,
  })
  cache?: number;

  @Prop({
    index: true,
    type: Number,
  })
  tdp?: number;

  @Prop({
    required: true,
    default: ENUM_CPU_MARKET_STATUS.UNKNOWN,
    enum: ENUM_CPU_MARKET_STATUS,
  })
  marketingStatus: ENUM_CPU_MARKET_STATUS;

  @Prop({
    type: Date,
  })
  launchDate?: Date;

  @Prop({
    type: Number,
  })
  maxMemorySize?: number;

  @Prop({
    type: String,
    trim: true,
  })
  memoryTypes?: string;

  @Prop({ type: Number })
  maxOfMemoryChannels?: number;

  @Prop({ type: String, trim: true })
  socketsSupported?: string;

  @Prop({ type: String, trim: true })
  packageSize?: string;

  @Prop({ type: Number })
  tjunction?: number;
}

export const CPUSchema = SchemaFactory.createForClass(CPUEntity);

export type CPUDoc = CPUEntity & Document;
