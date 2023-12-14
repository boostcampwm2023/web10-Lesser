import LoadingLesser from '../../assets/images/loading-image.png';

const Loading = () => (
  <div className="flex items-center justify-center w-full h-full">
    <img className="w-[7%] animate-[bounce_0.9s_ease-in-out_infinite]" src={LoadingLesser} alt="레서 판다" />
    <img className="w-[7%] animate-[bounce_0.9s_ease-in-out_0.1s_infinite]" src={LoadingLesser} alt="레서 판다" />
    <img className="w-[7%] animate-[bounce_0.9s_ease-in-out_0.3s_infinite]" src={LoadingLesser} alt="레서 판다" />
  </div>
);

export default Loading;
