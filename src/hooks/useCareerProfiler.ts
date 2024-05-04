import { calculateWinningCareer } from '@/utils/calculateWinningCareer';
import type { CareerScore, Opinion } from '@/types/CareerProfiler';
import type { CurrentAnswers } from '@/types/CurrentAnswers';
import { careerProfiler } from '@/data/careerProfiler';
import { useState } from 'react';

export const useCareerProfiler = () => {
  const [currentQuestionSlice, setCurrentQuestionSlice] = useState({ start: 0, end: 5 });
  const [currentAnswers, setCurrentAnswers] = useState<CurrentAnswers>({});

  const currentQuestions = careerProfiler.slice(currentQuestionSlice.start, currentQuestionSlice.end);
  const answeredQuestionsAmount = Object.keys(currentAnswers).length;

  const questionsAmount = careerProfiler.length;
  const isQuestionnaireComplete = answeredQuestionsAmount === questionsAmount;

  const QUESTIONS_PER_SLICE = 5;

  const handleGoToPreviousSlice = () => {
    setCurrentQuestionSlice((slices) => {
      if (slices.start === 0) return { ...slices };
      return { end: slices.end - QUESTIONS_PER_SLICE, start: slices.start - QUESTIONS_PER_SLICE };
    });
  };

  const handleGoToNextSlice = () => {
    setCurrentQuestionSlice((slices) => {
      if (slices.end === careerProfiler.length) return { ...slices };
      return { end: slices.end + QUESTIONS_PER_SLICE, start: slices.start + QUESTIONS_PER_SLICE };
    });
  };

  const handleSetCurrentAnswers = (id: string, opinion: Opinion, scores: CareerScore[]) => {
    setCurrentAnswers((answers) => ({ ...answers, [id]: { opinion, scores } }));
  };

  const handleCalculateResults = () => {
    const winningCareer = calculateWinningCareer(currentAnswers);
  };

  return {
    currentAnswers,
    currentQuestions,
    isQuestionnaireComplete,
    handleGoToNextSlice,
    handleCalculateResults,
    handleGoToPreviousSlice,
    handleSetCurrentAnswers,
  };
};
