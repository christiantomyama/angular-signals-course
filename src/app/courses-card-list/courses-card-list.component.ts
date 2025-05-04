import { Component, effect, ElementRef, inject, input, output, viewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { Course } from '../models/course.model';

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
  standalone: true,
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();
  courseUpdated = output<Course>();
  courseDeleted = output<string>();
  dialog = inject(MatDialog);
  courseCards = viewChildren<ElementRef>('courseCard');

  constructor() {
    // effect(() => {
    //   console.log('##courseCard', this.courseCards());
    // });
  }


  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Edit Course',
      course,
    });

    if (!newCourse) 
        return;
    
    console.log('##newCourse', newCourse);
    this.courseUpdated.emit(newCourse);
  }

  onCourseDeleted(courseId: string) {
    try {
        this.courseDeleted.emit(courseId);
    } catch (error) {
        console.log('##error', error);
        
    }
  }
}
