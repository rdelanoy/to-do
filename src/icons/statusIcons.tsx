import { CiAlarmOn, CiClock2, CiCircleRemove, CiCircleCheck, CiFaceFrown } from 'react-icons/ci';
import { StatusType } from '@/constants/status';
import { JSX } from 'react';

export const iconMap: Record<StatusType, React.ComponentType> = {
  pending: CiAlarmOn,
  progress: CiClock2,
  cancel: CiCircleRemove,
  done: CiCircleCheck,
};

export const DefaultStatusIcon = CiCircleRemove;

