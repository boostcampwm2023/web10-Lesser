import EpicDropdown from "../../components/backlog/EpicDropdown";

const UnfinishedStoryPage = () => (
  <div>
    UnfinishedStoryPage
    <EpicDropdown
      selectedEpic={{ id: 1, name: "프로젝트", color: "gray" }}
      epicList={[
        { id: 2, name: "백로그", color: "gray" },
        { id: 3, name: "에픽", color: "green" },
        { id: 4, name: "스토리", color: "red" },
      ]}
    />
  </div>
);

export default UnfinishedStoryPage;
