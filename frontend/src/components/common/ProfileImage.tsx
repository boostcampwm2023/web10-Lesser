const ProfileImage = ({ imageUrl, pxSize }: { imageUrl: string; pxSize: number }) => {
  return (
    <div
      className="ml-[0.46875rem] rounded-full overflow-hidden"
      style={{ height: pxSize, width: pxSize }}
    >
      <img src={imageUrl} alt="프로필 이미지 사진" />
    </div>
  );
};

export default ProfileImage;
