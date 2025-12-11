import { executeTvuCurriculum } from "./tvuCurriculum.js";
import { executeTvuGrades } from "./tvuGrades.js";
import { executeTvuLogin } from "./tvuLogin.js";
import { executeTvuNotifications } from "./tvuNotifications.js";
import { executeTvuSchedule } from "./tvuSchedule.js";
import { executeTvuSemesters } from "./tvuSemesters.js";
import { executeTvuStudentInfo } from "./tvuStudentInfo.js";
import { executeTvuTuition } from "./tvuTuition.js";

// Map command name -> executor function
export const toolExecutors = {
  tvuLogin: executeTvuLogin,
  tvuStudentInfo: executeTvuStudentInfo,
  tvuSemesters: executeTvuSemesters,
  tvuSchedule: executeTvuSchedule,
  tvuGrades: executeTvuGrades,
  tvuTuition: executeTvuTuition,
  tvuCurriculum: executeTvuCurriculum,
  tvuNotifications: executeTvuNotifications,
};

export const availableTools = Object.keys(toolExecutors);
