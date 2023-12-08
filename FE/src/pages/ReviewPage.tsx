import ReviewHeader from '../components/review/ReviewHeader';
import ReviewSprint from './../components/review/ReviewSprint';
import ReviewChart from '../components/review/ReviewChart';
import ReviewReminiscing from '../components/review/ReviewReminiscing';
import { Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../apis/api';
import { useState } from 'react';
import { useSelectedProjectState } from '../stores';

const ReviewPage = () => {
  const { id: projectId } = useSelectedProjectState();
  const [sprintId, setSprintId] = useState<number>(0);
  const projctId = useSelectedProjectState((state) => state.id);
  const { isLoading, data } = useQuery({
    queryKey: ['backlogs', projctId, sprintId],
    queryFn: () => api.get(`/reviews?project=${projectId}&sprint=${sprintId}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (data && data.selectedSprint.id !== sprintId) {
    setSprintId(data.selectedSprint.id);
  }

  return (
    <>
      <ReviewHeader data={data} setSprintId={setSprintId} />
      <Routes>
        <Route path="/sprint" element={<ReviewSprint data={data} />} />
        <Route path="/chart" element={<ReviewChart data={data} />} />
        <Route path="/write" element={<ReviewReminiscing data={data} />} />
      </Routes>
    </>
  );
};

export default ReviewPage;
