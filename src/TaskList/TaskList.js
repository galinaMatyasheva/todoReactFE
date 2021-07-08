import React from "react";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ClearIcon from "@material-ui/icons/Clear";
import axios from "axios";
import { TextField, Checkbox } from "@material-ui/core";

import "./TaskList.scss";

const TaskList = (props) => {
  const { tasks, textEdit, setTasks, setTextEdit } = props;

  const onChangeCheckbox = (e, index) => {
    tasks[index].isCheck = !tasks[index].isCheck;
    axios
      .patch("http://localhost:8000/tasks", {
        _id: tasks[index]._id,
        isCheck: tasks[index].isCheck,
      })
      .then((res) => {
        setTasks(res.data.data);
      });
  };

  const updateTask = (event) => {
    setTextEdit(event.target.value);
  };

  const applyChangesAfterBlur = (index) => {
    if (tasks[index].isEdit) {
      setTimeout(() => {
        if (tasks[index].isEdit) {
          onClickDoneTask(index);
        }
      }, 300);
    }
  };

  const onBlurField = (event, index) => {
    applyChangesAfterBlur(index);
    updateTask(event);
  };

  const OnDblClickField = (index) => {
    tasks.map((value, indx) => {
      tasks[indx].isEdit = false;
    });
    if (!tasks[index].isEdit) {
      tasks[index].isEdit = true;
      setTasks([...tasks]);
      setTextEdit(tasks[index].text);
    }
  };

  const onClickEditTask = (index) => {
    tasks.map((value, indx) => {
      tasks[indx].isEdit = false;
    });
    setTextEdit(tasks[index].text);
    tasks[index].isEdit = !tasks[index].isEdit;
    setTasks([...tasks]);
  };

  const onClickDeleteTask = (index) => {
    axios
      .delete(`http://localhost:8000/tasks/${tasks[index]._id}`)
      .then((res) => {
        setTasks(res.data.data);
      });
  };

  const onClickDoneTask = (index) => {
    if (!textEdit) {
      alert("Заполните поле!");
      return;
    }
    tasks[index].text = textEdit;
    tasks[index].isEdit = false;
    axios
      .patch("http://localhost:8000/tasks", {
        _id: tasks[index]._id,
        text: textEdit,
        isCheck: tasks[index].isCheck,
      })
      .then((res) => {
        setTasks(res.data.data);
      });
  };

  const onClickEnterDone = (event, index) => {
    if (event.code === "Enter") onClickDoneTask(index);
  };

  const onClickCancelTask = (index) => {
    tasks[index].isEdit = false;
    setTextEdit(textEdit);
    setTasks([...tasks]);
  };
  tasks.sort((a, b) => a.isCheck - b.isCheck);

  return (
    <div className="content-container">
      {tasks.map((task, index) => (
        <div
          key={`task-${index}`}
          className="content-container-task"
          onKeyUp={(event) => onClickEnterDone(event, index)}
        >
          <div className="container-field">
            <Checkbox
              style={{ display: tasks[index].isEdit ? "none" : "block" }}
              type="checkbox"
              checked={task.isCheck}
              onChange={(e) => onChangeCheckbox(e.target.value, index)}
            />
            {task.isEdit ? (
              <TextField
                className="input-text"
                type="text"
                value={textEdit}
                id="text"
                variant="filled"
                onChange={(e) => updateTask(e)}
                onBlur={(event) => onBlurField(event, index)}
              />
            ) : (
              <p
                onDoubleClick={() => OnDblClickField(index)}
                className={task.isCheck ? "check" : "not-check"}
              >
                {task.text}
              </p>
            )}
          </div>
          <div className="container-buttons">
            <IconButton
              className="icon-button"
              style={{ display: task.isEdit ? "none" : "block" }}
              onClick={() => onClickDeleteTask(index)}
            >
              <DeleteOutlineIcon />
            </IconButton>
            <IconButton
              className="icon-button"
              style={{
                display: task.isCheck || task.isEdit ? "none" : "block",
              }}
              onClick={() => onClickEditTask(index)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className="icon-button"
              onClick={() => onClickCancelTask(index)}
              style={{ display: !task.isEdit ? "none" : "block" }}
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              className="icon-button"
              onClick={() => onClickDoneTask(index)}
              style={{ display: !task.isEdit ? "none" : "block" }}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
