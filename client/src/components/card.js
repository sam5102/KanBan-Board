import React from "react";
import { Card, Col, Tooltip } from "antd";

const TaskCards = ({ task, deleteTask, updatingTask }) => {
  const dragStart = (e, id, title, description) => {
    e.dataTransfer.setData("taskId", id);
    e.dataTransfer.setData("title", title);
    e.dataTransfer.setData("description", description);
  };

  return (
    <Col
      span={24}
      key={task._id}
      style={{ paddingLeft: 0, cursor: "pointer", width: '100%' }}
      draggable
      onDragStart={(e) => dragStart(e, task._id, task.title, task.description)}
    >
        <Card
          type="inner"
          title={task.title}
          bordered={false}
          style={{
            width: 340,
            marginBottom: 30,
          }}
          actions={[
            <Tooltip placement="top" title="Delete Task">
              <img
                src="/recycle-bin.png"
                alt="Delete Task"
                height={18}
                width={18}
                onClick={() => deleteTask(task._id)}
              />
            </Tooltip>,
            <Tooltip placement="top" title="Edit Task">
              <img
                src="/edit.png"
                alt="Edit Task"
                height={18}
                width={18}
                onClick={() =>
                  updatingTask(
                    task._id,
                    task.title,
                    task.description,
                    task.status
                  )
                }
              />
            </Tooltip>,
          ]}
        >
          <p style={{ marginTop: 2 }}>{task.description}</p>
        </Card>

    </Col>
  );
};

export default TaskCards;
