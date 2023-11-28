import ReviewHeader from '../components/review/ReviewHeader';
import { useState } from 'react';
import ReviewSprint from './../components/review/ReviewSprint';
import ReviewChart from '../components/review/ReviewChart';
import ReviewReminiscing from '../components/review/ReviewReminiscing';

const reviewTabs = ['스프린트 정보', '차트', '회고란'];
const ReviewPage = () => {
  const [reviewTab, setReviewTab] = useState(reviewTabs[0]);

  return (
    <>
      <ReviewHeader reviewTabs={reviewTabs} currentReviewTab={reviewTab} onReviewTabChange={setReviewTab} />
      {reviewTab === '스프린트 정보' && <ReviewSprint />}
      {reviewTab === '차트' && <ReviewChart />}
      {reviewTab === '회고란' && <ReviewReminiscing />}
    </>
  );
};

export default ReviewPage;
