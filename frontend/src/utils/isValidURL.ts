const isValidURL = (url: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // 프로토콜
      "((([a-z\\d가-힣]([a-z\\d가-힣-]*[a-z\\d가-힣])*)\\.?)+[a-z가-힣]{2,}|" + // 도메인명
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) 주소
      "(\\:\\d+)?" + // 포트
      "(\\/[-a-z\\d%_.~+가-힣]*)*" + // 경로
      "(\\?[;&a-z\\d%_.~+=-가-힣]*)?" + // 쿼리 문자열
      "(\\#[-a-z\\d_가-힣]*)?$",
    "i"
  );

  return pattern.test(url);
};

export default isValidURL;
