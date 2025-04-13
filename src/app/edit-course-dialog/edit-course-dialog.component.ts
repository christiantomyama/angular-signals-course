import { Component, effect, inject, signal, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CourseCategory } from '../models/course-category.model';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  form = this.fb.group({
    title: [''],
    longDescription: [''],
    iconUrl: [''],
  });

  courseService = inject(CoursesService);
  category = signal<CourseCategory>('BEGINNER');

  constructor() {
    //     this.form.patchValue(this.data.course!);
    console.log('##this.data?.course', this.data?.course);
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      iconUrl: this.data?.course?.iconUrl,
    });
    this.category.set(this.data?.course?.category ?? 'BEGINNER');

    effect(() => {
        console.log('##category', this.category());
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();

    if (this.data.mode === 'update') {
      this.saveCourse(this.data.course!.id, courseProps);
    } else if (this.data.mode === 'create') {
      this.createCourse(courseProps);
    }
  }

  async saveCourse(couserId: string, course: Partial<Course>) {
    try {
      const updatedCourse = await this.courseService.saveCourse(
        couserId,
        course
      );
      this.dialogRef.close(updatedCourse);
    } catch (error) {
      console.log('##error', error);
      alert('Error saving course');
    }
  }

  async createCourse(course: Partial<Course>) {
    try {
      const createdCourse = await this.courseService.createCourse(course);
      this.dialogRef.close(createdCourse);
    } catch (error) {
      console.log('##error', error);
      alert('Error saving course');
    }
  }
}

export async function openEditCourseDialog(
  matDialog: MatDialog,
  data: EditCourseDialogData
) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const close$ = matDialog
    .open(EditCourseDialogComponent, config)
    .afterClosed();

  return firstValueFrom(close$);
}
