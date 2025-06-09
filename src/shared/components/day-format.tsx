import dayjs from 'dayjs';

interface DayFormatProps {
  date: string;
  format: EDateFormatType;
}

export enum EDateFormatType {
  DD_MM_YYYY = 'DD/MM/YYYY',
  DD_MM_YYYY_HH_MM = 'DD/MM/YYYY HH:mm',
  DD_MM_YYYY_HH_MM_SS = 'DD/MM/YYYY HH:mm:ss',
  HH_MM_SS_DD_MM_YYYY = 'HH:mm:ss DD/MM/YYYY',
  HH_MM_DD_MM_YYYY = 'HH:mm DD/MM/YYYY',
}

export default function DayFormat({ date, format }: DayFormatProps) {
  return <div>{date ? dayjs(date).format(format) : '-'}</div>;
}
