import EpicBlock from '../../components/backlog/EpicBlock';
import useBlock from '../../hooks/useBlock';

const BacklogPage = () => {
  const { items, newItemTitle, showForm, formRef, handleAddButton, handleFormSubmit, setNewItemTitle } = useBlock();

  return (
    <div className="border-2 border-black">
      <h1>Backlog Page</h1>
      {items.map((item) => (
        <EpicBlock key={item} epicTitle={item} />
      ))}
      {showForm ? (
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder={`Enter Epic Title`}
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
          />
          <button className="border px-8" type="submit">
            + Epic 생성하기
          </button>
        </form>
      ) : (
        <button className="border px-8" onClick={handleAddButton}>
          + Epic 생성하기
        </button>
      )}
    </div>
  );
};

export default BacklogPage;
