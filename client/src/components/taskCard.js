import React from "react";
import TaskCards from "./card";
import { Col } from "antd";
import { useOrientation } from "@uidotdev/usehooks";
import { UPDATE_TASK, DELETE_TASK } from "../constant";

import "./taskCard.css";

const TaskCard = ({ data, fetchingTasks, updatingTask, openNotification }) => {
  const isPortrait = useOrientation();

  const deleteTask = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer my-token",
        "My-Custom-Header": "foobar",
      },
    };
    fetch(`${DELETE_TASK}${id}`, requestOptions).then(() => {
      openNotification("Task Deleted Successfully", "Task removed from board.");
      fetchingTasks();
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const updateTask = (taskId, title, description, targetStatus) => {
    const taskObj = {
      title: title,
      description: description,
      status: targetStatus,
    };

    fetch(`${UPDATE_TASK}${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskObj),
    })
      .then((response) => {
        response.json();
        openNotification("Task Updated successfully", `Task moved to ${targetStatus}`);
        fetchingTasks()
      })
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const title = e.dataTransfer.getData('title');
    const description = e.dataTransfer.getData('description');
    updateTask(taskId, title, description, targetStatus)
  };

  return (
    <div gutter={8} className="board" style={{ flexFlow: isPortrait.type === "portrait-primary" ? "column" : null}}>
      <Col
        xs={{ span: 5, offset: 1 }}
        lg={{ span: 6, offset: 2 }}
        style={{ marginLeft: isPortrait.type === "portrait-primary" ? null : 25, width: 340 }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "todo")}
      >
        <p className="taskHeading">To Do</p>
        {data.map((task, index) => {
          return task.status === "todo" ? (
            <TaskCards
              task={task}
              deleteTask={deleteTask}
              updatingTask={updatingTask}
              key={task._id}
            />
          ) : null;
        })}
      </Col>
      <Col
        xs={{ span: 5, offset: 1 }}
        lg={{ span: 6, offset: 2 }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "doing")}
      >
        <p className="taskHeading">Doing</p>
        {data.map((task, index) => {
          return task.status === "doing" ? (
            <TaskCards
              task={task}
              deleteTask={deleteTask}
              updatingTask={updatingTask}
              key={task._id}
            />
          ) : null;
        })}
      </Col>
      <Col
        xs={{ span: 5, offset: 1 }}
        lg={{ span: 6, offset: 2 }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "done")}
      >
        <p className="taskHeading">Done</p>
        {data.map((task, index) => {
          return task.status === "done" ? (
            <TaskCards
              task={task}
              deleteTask={deleteTask}
              updatingTask={updatingTask}
              key={task._id}
            />
          ) : null;
        })}
      </Col>
    </div>
  );
};

export default TaskCard;
