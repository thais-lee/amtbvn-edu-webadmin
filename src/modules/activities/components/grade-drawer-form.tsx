import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Collapse,
  Drawer,
  Input,
  List,
  Space,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import useApp from '@/hooks/use-app';

import activityService from '../activity.service';
import { EActivityAttemptGradingStatus } from '../dto/activity.dto';
import GradeCardForm from './grade-card-form';

const { Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Search } = Input;

interface GradeDrawerFormProps {
  activityId: number;
  activityTitle?: string;
  open: boolean;
  onClose: () => void;
}

export default function GradeDrawerForm({
  activityId,
  activityTitle,
  open,
  onClose,
}: GradeDrawerFormProps) {
  const [gradingAttempt, setGradingAttempt] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const { t } = useApp();

  const { data: attempts, isLoading } = useQuery({
    queryKey: ['attempts', activityId, search],
    queryFn: () =>
      activityService.getAttempts({
        activityId,
        search,
      }),
    select: (data) => data.data.items,
    enabled: !!activityId,
  });

  const students = Array.from(
    new Map(attempts?.map((a) => [a.student.id, a.student])).values(),
  );

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName}`;
    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  const attemptsByStudent = (studentId: number) =>
    attempts?.filter((a) => a.student.id === studentId);

  const handleGrade = (attempt: any) => {
    setGradingAttempt(attempt);
    setScore(attempt.score ?? null);
    setFeedback(attempt.feedback ?? '');
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success('Đã lưu chấm điểm (mock)');
      setGradingAttempt(null);
    }, 1000);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={700}
      title={activityTitle ? `Chấm điểm: ${activityTitle}` : 'Chấm điểm'}
      destroyOnHidden={true}
    >
      {!gradingAttempt ? (
        <>
          <Search
            placeholder="Tìm kiếm học viên..."
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 16, maxWidth: 320 }}
          />
          <Collapse accordion>
            {filteredStudents.map((student) => (
              <Panel
                header={
                  <Space>
                    <Text strong>
                      {student.firstName} {student.lastName}
                    </Text>
                  </Space>
                }
                key={student.id}
              >
                <List
                  dataSource={attemptsByStudent(student.id)}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <Button
                          key={item.id}
                          type={
                            item.gradingStatus ===
                            EActivityAttemptGradingStatus.GRADED
                              ? 'default'
                              : 'primary'
                          }
                          size="small"
                          onClick={() => handleGrade(item)}
                        >
                          {item.gradingStatus ===
                          EActivityAttemptGradingStatus.GRADED
                            ? t('Xem & Sửa')
                            : t('Chấm điểm')}
                        </Button>,
                      ]}
                    >
                      <Space direction="vertical">
                        <Text>
                          <b>{t('Lần nộp:')}</b> {item.attemptNumber} |{' '}
                          <b>{t('Thời gian:')}</b>{' '}
                          {dayjs(item.startedAt).format('DD/MM/YYYY HH:mm') ||
                            t('Chưa nộp')}
                        </Text>
                        <Text>
                          {t('Trạng thái:')}{' '}
                          {item.gradingStatus || t('Chưa chấm')}
                        </Text>
                        <Text>
                          {t('Điểm:')} {item.score ?? t('Chưa chấm')}
                        </Text>
                        {item.graderFeedback && (
                          <Text>
                            {t('Phản hồi:')} {item.graderFeedback}
                          </Text>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </>
      ) : (
        <GradeCardForm
          gradingAttempt={gradingAttempt}
          onBack={() => setGradingAttempt(null)}
        />
      )}
    </Drawer>
  );
}
