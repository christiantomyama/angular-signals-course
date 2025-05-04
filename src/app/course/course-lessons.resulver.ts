import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { inject } from '@angular/core';
import { Lesson } from '../models/lesson.model';
import { LessonsService } from '../services/lessons.service';

export const courseLessonsResolver: ResolveFn<Lesson[] | null> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const courseId = route.paramMap.get('courseId');
  if (!courseId) {
    return null;
  }
  const service = inject(LessonsService);
  return service.loadLessons({ courseId });
};
