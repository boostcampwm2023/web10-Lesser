import { useState, useRef, useEffect } from 'react';

const useBlock = () => {
  const [items, setItems] = useState<string[]>([]);
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddButton = () => {
    setShowForm(!showForm);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setShowForm(false);
      setNewItemTitle('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemTitle.trim() !== '') {
      setItems([...items, newItemTitle]);
      setNewItemTitle('');
      setShowForm(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    items,
    newItemTitle,
    showForm,
    formRef,
    handleAddButton,
    handleFormSubmit,
    setNewItemTitle,
  };
};

export default useBlock;
