import { TCourse } from '../courses/course.model';
import { TUser } from '../users/user.model';
import { EEnrollmentStatus } from './dto/enrollment.dto';

export interface TEnrollment {
  courseId: number;
  userId: number;
  status: EEnrollmentStatus;
  enrolledAt: string;
  completedAt: string;
  progressPercentage: number;
  lastAccessedAt: string;
  course: TCourse;
  user: TUser;
}
