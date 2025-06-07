import { TCourse } from '../courses/course.model';
import { LessonStatus } from './dto/lesson.dto';

export interface TLesson {
  id: number;
  title: string;
  content: string;
  isImportant: boolean;
  status: LessonStatus;
  courseId: number;
  previousId: number;
  createdAt: string;
  updatedAt: string;
  course: TCourse;
  previous: TLesson;
  next: TLesson;
}
