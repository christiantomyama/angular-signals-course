import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  http = inject(HttpClient);

  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.http.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`
    );
    const response = await firstValueFrom(courses$);

    return response.courses;
    // return await this.http.get<Course[]>(`${environment.apiRoot}/courses`).toPromise();
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const courses$ = this.http.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );

    const response = firstValueFrom(courses$);
    return response;
  }

  async saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    const courses$ = this.http.put<Course>(
      `${this.env.apiRoot}/courses/${courseId}`,
      course
    );

    const response = firstValueFrom(courses$);
    return response;
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courses$ = this.http.delete<void>(
      `${this.env.apiRoot}/courses/${courseId}`
    );
    const response = firstValueFrom(courses$);
    return response;
  }
}
