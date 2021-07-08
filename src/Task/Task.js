import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";

import TaskList from "../TaskList/TaskList";
import "./Task.scss";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [textEdit, setTextEdit] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/tasks").then((res) => {
      setTasks(res.data.data);
    });
  }, []);

  const addNewTask = () => {
    if (!text) {
      alert("Введите данные!");
      return;
    }
    axios
      .post("http://localhost:8000/tasks", {
        text,
        isCheck: false,
      })
      .then((res) => {
        setText("");
        setTextEdit(text);
        setTasks(res.data.data);
      });
  };

  const onClickEnter = (event) => {
    if (event.code === "Enter") {
      addNewTask();
    }
  };

  const onClickDeleteAllTask = () => {
    tasks.forEach(() => {
      axios.delete(`http://localhost:8000/tasks`).then((res) => {
        setTasks(res.data);
      });
    });
  };

  return (
    <div className="App">
      <div className="field" onKeyUp={(event) => onClickEnter(event)}>
        <TextField
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="filled"
        />
        <Button onClick={() => addNewTask()} variant="outlined">
          Add new
        </Button>
      </div>
      <Button
        className="delete-all"
        onClick={() => onClickDeleteAllTask()}
        variant="outlined"
      >
        Delete all
      </Button>
      <TaskList
        tasks={tasks}
        textEdit={textEdit}
        setTasks={setTasks}
        setTextEdit={setTextEdit}
      />
    </div>
  );
};

export default Task;
