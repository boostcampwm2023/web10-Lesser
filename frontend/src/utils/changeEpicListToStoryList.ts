import { UnfinishedStory } from "../types/common/backlog";
import { EpicDTO } from "../types/DTO/backlogDTO";

const changeEpicListToStoryList = (epicList: EpicDTO[]) => {
  const newStoryList: UnfinishedStory[] = [];
  epicList.forEach(({ id, name, color, storyList }) => {
    storyList.forEach((story) => {
      const newStory = { ...story, epic: { id, name, color } };
      newStoryList.push(newStory);
    });
  });

  return newStoryList;
};

export default changeEpicListToStoryList;
