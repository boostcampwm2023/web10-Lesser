import { useRef, useState } from 'react';
import { ProjectUser } from '../../../types/project';
import fetchGetUsername from '../../../apis/project/fetchGetUsername';

const useSearchUsername = () => {
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [userList, setUserList] = useState<ProjectUser[]>([]);

  const handleSearchClick = async () => {
    if (!usernameInputRef.current) return;

    if (!usernameInputRef.current.value) {
      window.alert('닉네임을 입력해주세요');
      return;
    }

    if (userList.some((user) => user.userName === usernameInputRef.current?.value)) {
      window.alert('이미 존재하는 닉네임입니다.');
      return;
    }

    const { status, data } = await fetchGetUsername(usernameInputRef.current.value);

    if (status === 404) {
      window.alert('존재하지 않는 닉네임입니다');
      return;
    }
    setUserList((userList) => [...userList, data]);
    usernameInputRef.current.value = '';
  };

  const handleDeleteClick = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    setUserList((userList) => [...userList].filter((user) => user.userId !== Number(currentTarget.id)));
  };

  return { userList, usernameInputRef, handleSearchClick, handleDeleteClick };
};

export default useSearchUsername;
