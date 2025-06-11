import { TAttachment } from '../attachments/attachment.model';
import { TCourse } from '../courses/course.model';
import { TLesson } from '../lessons/lesson.model';
import {
  EActivityStatus,
  EActivityType,
  TActivityQuestion,
} from './dto/activity.dto';

export interface TActivity {
  id: number;
  title: string;
  description: string;
  type: EActivityType;
  dueDate: Date;
  maxAttempts: number;
  passScore: number;
  timeLimitMinutes: number;
  lessonId?: number;
  courseId?: number;
  status: EActivityStatus;
  createdAt: Date;
  updatedAt: Date;
  lesson?: TLesson;
  course?: TCourse;
  // materials?: TAttachment[];
  questions?: TActivityQuestion[];
}
