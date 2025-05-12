import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CourseComponent } from '../course/course.component';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { MatTooltip } from '@angular/material/tooltip';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, from, interval, startWith } from 'rxjs';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent, CourseComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  dialog = inject(MatDialog);
  coursesService = inject(CoursesService);
  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  messageServices = inject(MessagesService);
  begginersList = viewChild('beginnersList', {
    read: MatTooltip,
  });

  //   courses$ = toObservable(this.#courses);

  constructor() {
    this.courses$.subscribe((courses) => console.log(courses));

    effect(() => {
      //   console.log('begginersList', this.begginersList());
    });
    this.loadCourses();
    // .then(() =>console.log('all couses loaded', this.#courses()));
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.messageServices.showMessage('Error loading courses!', 'error');
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (error) {
      console.log('##error', error);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create Course',
    });
    if (!newCourse) return;
    this.#courses.set([...this.#courses(), newCourse]);
  }

  onToObservableExample() {
    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);

    const numbers$ = toObservable(numbers, { injector: this.injector });
    numbers.set(4);
    const subscription = numbers$.subscribe((value) => {
      console.log('numbers$ value', value);
    });
    numbers.set(5);
  }

  injector = inject(Injector);
  courses$ = from(this.coursesService.loadAllCourses());

  toSignalExample() {
    try {
      const courses$ = from(this.coursesService.loadAllCourses()).pipe(
        catchError((err) => {
          console.log('catchError 1 ', err);
          throw err;
        })
      );

      const courses = toSignal(courses$, {
        injector: this.injector,
        rejectErrors: true,
      });
      effect(
        () => {
          console.log('number$ 3', courses());
        },
        { injector: this.injector }
      );

      setInterval(() => {
        console.log('number$ 4', courses());
      }, 1000);
    } catch (error) {
      console.log('##catch BLOCK error 2 ', error);
    }
  }
}
