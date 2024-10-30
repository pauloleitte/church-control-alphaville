import { Injectable } from '@nestjs/common';
import { LessonService } from '../../lesson/services/lesson.service';
import { FilterParams } from 'src/app/shared/utils/filter-params';

type DailyReport = {
  date: string;
  group: string;
  key: string;
  studentsPresent: number;
  studentsAbsent: number;
  offerValue: string;
};

type LightHouseReport = {
  group: string;
  hasAnApperanceAlredyBeenMade: boolean;
};

@Injectable()
export class DashboardService {
  constructor(private readonly lessonService: LessonService) {}

  async generateReportByDaily(params: FilterParams) {
    const { lessons } = await this.lessonService.getAll({
      date: params.date,
    });

    const report: DailyReport[] = [];

    lessons.forEach((lesson) => {
      const { date, group, attendance } = lesson;

      const lessonDate = new Date(date).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });
      const key = `${lessonDate}-${group.name}`;

      report.push({
        date: lessonDate,
        group: group.name,
        key,
        studentsPresent: attendance.filter((a) => a.isPresent).length,
        studentsAbsent: attendance.filter((a) => !a.isPresent).length,
        offerValue: lesson.offerValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      });
    });

    return report;
  }

  async getLightHouseByDaily(params: FilterParams) {
    const { lessons } = await this.lessonService.getAll({
      date: params.date,
    });

    const report: LightHouseReport[] = [];

    lessons.forEach((lesson) => {
      const { group, attendance } = lesson;

      report.push({
        group: group.name,
        hasAnApperanceAlredyBeenMade: attendance.length > 0,
      });
    });

    return report;
  }
}
