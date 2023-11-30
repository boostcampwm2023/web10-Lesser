import ReviewHeader from '../components/review/ReviewHeader';
import ReviewSprint from './../components/review/ReviewSprint';
import ReviewChart from '../components/review/ReviewChart';
import ReviewReminiscing from '../components/review/ReviewReminiscing';
import { Route, Routes } from 'react-router-dom';

const ReviewPage = () => (
  <>
    <ReviewHeader />
    <Routes>
      <Route path="/" Component={ReviewSprint} />
      <Route path="/chart" Component={ReviewChart} />
      <Route path="/remi" Component={ReviewReminiscing} />
    </Routes>
  </>
);

export default ReviewPage;
