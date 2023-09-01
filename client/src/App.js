import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  theme,
  Button,
  Modal,
  Input,
  Space,
  Tag,
  notification,
} from "antd";
import loader from "./giphy.gif";
import logo from './logo.jpg'
import "./App.css";
import TaskCard from "./components/taskCard";
import { FETCH_TASKS, POST_TASK, UPDATE_TASK } from "./constant";

const { TextArea } = Input;
const { CheckableTag } = Tag;
const { Header, Content, Footer } = Layout;

const tagsData = ["todo", "doing", "done"];

const App = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedTags, setSelectedTags] = useState(["todo"]);

  useEffect(() => {
    fetchingTasks();
  }, [isModalOpen]);

  const fetchingTasks = (value, label) => {
    fetch(FETCH_TASKS)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setTaskData(json);
      });
  };

  const openNotification = (message, description) => {
    const placement = "bottomLeft";
    notification.success({
      message,
      description,
      placement,
    });
  };

  const showModal = () => {
    setIsUpdate(false);
    setIsModalOpen(true);
  };

  const updateOpenTask = (id, title, description, status) => {
    setIsUpdate(true);
    setTitle(title);
    setDescription(description);
    setTaskId(id);
    setSelectedTags([status]);
    setIsModalOpen(true);
  };

  const createTask = () => {
    const taskObj = {
      title: title,
      description: description,
      status: selectedTags[0],
    };

    fetch(POST_TASK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskObj),
    })
      .then((response) => {
        response.json();
        setIsModalOpen(false);
        openNotification("Task Created successfully", "Task added on board");
        setTitle("");
        setDescription("");
      })
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateTask = () => {
    const taskObj = {
      title: title,
      description: description,
      status: selectedTags[0],
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
        setIsModalOpen(false);
        openNotification("Task Updated successfully", "Task modified on board");
        setTitle("");
        setDescription("");
        setSelectedTags(["todo"]);
      })
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [tag]
      : selectedTags.filter((t) => t !== tag);
    console.log("You are interested in: ", nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescChange = (e) => {
    setDescription(e.target.value);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>

        <Header className="headerText" style={{ background: colorBgContainer }}>
        <img src={logo} alt="logo" height={30} width={130} />
          <span>KenBan Board</span>
        </Header>
        
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                Add Task
              </Button>

              <Modal
                title={isUpdate ? "Update Task" : "Create Task"}
                open={isModalOpen}
                okText={isUpdate ? "Update" : "Create"}
                onOk={isUpdate ? updateTask : createTask}
                onCancel={handleCancel}
              >
                <p>Title</p>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={handleTitleChange}
                />
                <br />
                <p>Description</p>
                <TextArea
                  rows={4}
                  placeholder="Description"
                  value={description}
                  onChange={handleDescChange}
                />
                <br />
                <br />
                <span style={{ marginRight: 8 }}>Task Status: </span>
                <Space size={[0, 8]} wrap>
                  {tagsData.map((tag) => (
                    <CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </Space>
              </Modal>
            </div>
          </Breadcrumb>

          {taskData.length > 0 ? (
            <TaskCard
              data={taskData}
              fetchingTasks={fetchingTasks}
              updatingTask={updateOpenTask}
              openNotification={openNotification}
            />
          ) : (
            <img
              src={loader}
              alt="loading..."
              className="loader"
            />
          )}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Kanban ©2023 Created by Sam
        </Footer>
    </Layout>
  );
};

export default App;
