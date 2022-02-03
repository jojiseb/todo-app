import React from 'react';

const Todo = ({todo}) => {
  return (
  <div>
      <h1>{todo.task}</h1>
      <p>{todo.description}</p>
      <span>
      <button>Delete</button>
      <button>Complete</button>
      <button>Favourite</button>
      </span>
  </div>
  );
};

export default Todo;
