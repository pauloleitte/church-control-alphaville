import { SortOrder } from 'mongoose';

export class FilterParams {
  name?: string;
  page?: number;
  sort?: SortOrder;
  userId?: string;
  groupId?: string;
  role?: string;
  date?: string;
}