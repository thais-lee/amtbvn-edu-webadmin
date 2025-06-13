import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Divider,
  Input,
  List,
  Space,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';

import activityService from '../activity.service';
import { TActivityAttempt, TActivityAttemptAnswer } from '../dto/activity.dto';
import { EActivityQuestionType } from '../dto/activity.dto';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface GradeCardFormProps {
  gradingAttempt: TActivityAttempt;
  onBack: () => void;
}

export default function GradeCardForm({
  gradingAttempt,
  onBack,
}: GradeCardFormProps) {
  const { t } = useApp();
  const queryClient = useQueryClient();
  const [overallFeedback, setOverallFeedback] = useState(
    gradingAttempt.graderFeedback || '',
  );
  const [saving, setSaving] = useState(false);

  const { data: attemptDetail } = useQuery({
    queryKey: ['attemptDetail', gradingAttempt.id],
    queryFn: () => activityService.getAttemptDetail(gradingAttempt.id!),
    select: (data) => data.data,
    enabled: !!gradingAttempt.id,
  });

  // Feedback per answer (id: feedback)
  const [answerFeedback, setAnswerFeedback] = useState<Record<number, string>>(
    () =>
      Object.fromEntries(
        (attemptDetail?.answers || []).map((a: TActivityAttemptAnswer) => [
          a.id,
          a.feedback || '',
        ]),
      ),
  );

  // Score per answer (id: score)
  const [answerScores, setAnswerScores] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      (attemptDetail?.answers || []).map((a: TActivityAttemptAnswer) => [
        a.id,
        a.score || 0,
      ]),
    ),
  );

  const gradeMutation = useMutation({
    mutationFn: (data: {
      id: number;
      answers: any[];
      overallFeedback: string;
    }) =>
      activityService.gradeAttempt(data.id, {
        answers: data.answers,
        overallFeedback: data.overallFeedback,
      }),
    onSuccess: () => {
      message.success(t('Đã lưu chấm điểm thành công'));
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
      onBack();
    },
    onError: (error) => {
      message.error(t('Có lỗi xảy ra khi lưu chấm điểm'));
      console.error('Grading error:', error);
    },
  });

  const isManuallyGradedQuestion = (type: string) => {
    return (
      type === EActivityQuestionType.SHORT_ANSWER ||
      type === EActivityQuestionType.ESSAY
    );
  };

  const handleSave = () => {
    if (!attemptDetail?.answers) return;

    const answers = attemptDetail.answers.map((ans) => ({
      id: ans.id!,
      score: isManuallyGradedQuestion(ans.question.type)
        ? answerScores[ans.id!] || 0
        : ans.score || 0, // Keep original score for auto-graded questions
      feedback: answerFeedback[ans.id!] || '',
    }));

    gradeMutation.mutate({
      id: gradingAttempt.id!,
      answers,
      overallFeedback,
    });
  };

  return (
    <Card
      title={
        <span>
          {t('Chấm điểm cho')} {gradingAttempt.student?.firstName}{' '}
          {gradingAttempt.student?.lastName} ({t('Lần nộp:')}{' '}
          {gradingAttempt.attemptNumber})
        </span>
      }
      extra={
        <Text strong>
          {t('Tổng điểm')}:{' '}
          {Object.entries(answerScores).reduce((sum, [id, score]) => {
            const answer = attemptDetail?.answers.find(
              (a) => a.id === Number(id),
            );
            return (
              sum +
              (isManuallyGradedQuestion(answer?.question.type || '')
                ? score
                : answer?.score || 0)
            );
          }, 0)}
        </Text>
      }
    >
      <List
        dataSource={attemptDetail?.answers}
        renderItem={(ans: TActivityAttemptAnswer, idx) => {
          const question = ans.question;
          const correctOption = question.options?.find((o) => o.isCorrect);
          const studentOption = question.options?.find(
            (o) => o.id === ans.selectedOptionId,
          );
          const isManuallyGraded = isManuallyGradedQuestion(question.type);

          return (
            <List.Item key={ans.id} style={{ alignItems: 'flex-start' }}>
              <Card style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>
                    {idx + 1}. {question.question}
                  </Text>
                  <Text>
                    <b>{t('Đáp án của học viên')}:</b>{' '}
                    {question.type === 'MULTIPLE_CHOICE' && studentOption
                      ? studentOption?.text
                      : ans.answer || ''}
                  </Text>
                  <Text>
                    <b>{t('Đáp án đúng')}:</b>{' '}
                    {question.type === 'MULTIPLE_CHOICE'
                      ? correctOption?.text || ''
                      : correctOption?.text || ''}
                  </Text>
                  {isManuallyGraded ? (
                    <Space>
                      <Text>
                        <b>{t('Điểm')}:</b>
                      </Text>
                      <Input
                        type="number"
                        min={0}
                        max={question.points}
                        value={answerScores[ans.id!]}
                        onChange={(e) =>
                          setAnswerScores({
                            ...answerScores,
                            [ans.id!]: Number(e.target.value),
                          })
                        }
                        style={{ width: 80 }}
                      />
                      <Text>/ {question.points}</Text>
                    </Space>
                  ) : (
                    <Text>
                      <b>{t('Điểm')}:</b> {ans.score || 0} / {question.points}
                    </Text>
                  )}
                  <TextArea
                    rows={2}
                    value={answerFeedback[ans.id!]}
                    onChange={(e) =>
                      setAnswerFeedback({
                        ...answerFeedback,
                        [ans.id!]: e.target.value,
                      })
                    }
                    placeholder={t('Nhập đánh giá cho câu hỏi này (tùy chọn)')}
                  />
                </Space>
              </Card>
            </List.Item>
          );
        }}
      />
      <Divider />
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <TextArea
          rows={3}
          value={overallFeedback}
          onChange={(e) => setOverallFeedback(e.target.value)}
          placeholder={t('Nhập đánh giá chung (tùy chọn)')}
        />
        <Space>
          <Button onClick={onBack}>{t('Quay lại')}</Button>
          <Button
            type="primary"
            loading={gradeMutation.isPending}
            onClick={handleSave}
          >
            {t('Lưu')}
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
