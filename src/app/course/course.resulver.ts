import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Course } from "../models/course.model";
import { CoursesService } from "../services/courses.service";
import { inject } from "@angular/core";

export const courseResolver: ResolveFn<Course | null> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const courseId = route.paramMap.get('courseId');
        if (!courseId) {
            return null; // or handle the error as needed
        }
        const coursesService = inject(CoursesService);
        return coursesService.getCourseById(courseId);
    }