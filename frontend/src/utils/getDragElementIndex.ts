const getDragElementIndex = (
  list: HTMLDivElement[],
  initialIndex: number | undefined,
  y: number
) =>
  list.reduce(
    (closest, child, index) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      console.log(offset);

      if (offset < 0 && offset > closest.offset) {
        return { offset, index };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
      index: initialIndex,
    }
  ).index;

export default getDragElementIndex;
