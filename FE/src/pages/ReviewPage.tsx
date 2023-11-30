import ReviewHeader from '../components/review/ReviewHeader';
import ReviewSprint from './../components/review/ReviewSprint';
import ReviewChart from '../components/review/ReviewChart';
import ReviewReminiscing from '../components/review/ReviewReminiscing';
import { Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../apis/api';

const ReviewPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['review'],
    queryFn: () => api.get('/reviews?project=1&sprint=0').then((res) => res.data),
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Something is wrong 😢</p>}
      {data && (
        <>
          <ReviewHeader sprintList={data.sprintList} currentSprintId={data.selectedSprint.id} />
          <Routes>
            <Route path="/" element={<ReviewSprint {...data.selectedSprint} />} />
            <Route path="/chart" element={<ReviewChart {...data.selectedSprint} />} />
            <Route path="/remi" element={<ReviewReminiscing />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default ReviewPage;
