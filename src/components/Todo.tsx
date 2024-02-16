import React from 'react';
import { useTodosIds } from '../services/queries';

const Todo = () => {
  const todosIdsQuery = useTodosIds();

  if (todosIdsQuery.isPending) {
    return <span>loading...</span>;
  }

  if (todosIdsQuery.isError) {
    return <span>there is a error!</span>;
  }

  return (
    <div>
      {todosIdsQuery.data.map((id) => (
        <p key={id}>{id}</p>
      ))}
    </div>
  );
};

export default Todo;
