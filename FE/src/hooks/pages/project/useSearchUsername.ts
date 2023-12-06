import { useRef, useState } from 'react';
import { ProjectUser } from '../../../types/project';
import { fetchGetUsername } from '../../../apis/project';

const useSearchUsername = () => {
  const usernameSearchbar = useRef<HTMLInputElement>(null);
  const [userList, setUserList] = useState<ProjectUser[]>([]);

  const handleSearchClick = async () => {
    if (!usernameSearchbar.current) return;

    if (!usernameSearchbar.current.value) {
      window.alert('닉네임을 입력해주세요');
      return;
    }

    if (userList.some((user) => user.userName === usernameSearchbar.current?.value)) {
      window.alert('이미 존재하는 닉네임입니다.');
      return;
    }

    const { status, data } = await fetchGetUsername(usernameSearchbar.current.value);

    if (status === 404) {
      window.alert('존재하지 않는 닉네임입니다');
      return;
    }
    setUserList((userList) => [...userList, data]);
  };

  const handleDeleteClick = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    setUserList((userList) => [...userList].filter((user) => user.userId !== Number(currentTarget.id)));
  };

  return { userList, usernameSearchbar, handleSearchClick, handleDeleteClick };
};

export default useSearchUsername;
