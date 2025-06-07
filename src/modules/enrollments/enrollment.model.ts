import { TCourse } from '../courses/course.model';
import { TUser } from '../users/user.model';

export interface TEnrollment {
  id: number;
  courseId: number;
  userId: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string;
  progressPercentage: number;
  lastAccessedAt: string;
  course: TCourse;
  user: TUser;
}

enum EnrollmentStatus {
  Enrolled = 'ENROLLED',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',
}
