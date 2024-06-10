import React, { useState, useEffect } from 'react';
import './App.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Notification from './notification';

const translations = {
  EN: {
    searchPlaceholder: 'Search task',
    addTaskButton: '+ Add Task',
    newTaskModalTitle: 'New task',
    newTaskModalBody: 'Add new task from here.',
    taskNameLabel: 'Task name',
    taskTimeLabel: 'Task time',
    taskAddedMessage: 'Task added successfully',
    closeButton: 'Close',
    createTaskButton: 'Create task',
    deleteButton: 'Delete',
    taskTitle: 'Task #',
    taskName: 'Task name',
    taskTime: 'Time',
    languageLabel: 'Language'
  },
  AR: {
    searchPlaceholder: 'ابحث عن المهمة',
    addTaskButton: '+ إضافة مهمة',
    newTaskModalTitle: 'مهمة جديدة',
    newTaskModalBody: 'أضف مهمة جديدة من هنا.',
    taskNameLabel: 'اسم المهمة',
    taskTimeLabel: 'وقت المهمة',
    taskAddedMessage: 'تمت إضافة المهمة بنجاح',
    closeButton: 'إغلاق',
    createTaskButton: 'إنشاء مهمة',
    deleteButton: 'حذف',
    taskTitle: 'مهمة #',
    taskName: 'اسم المهمة',
    taskTime: 'الوقت',
    languageLabel: 'اللغة'
  }
};

const App = () => {
  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Error parsing tasks from local storage:', error);
        return [];
      }
    } else {
      return [];
    }
  };

  const [tasks, setTasks] = useState(loadTasksFromLocalStorage());
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [language, setLanguage] = useState('EN');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [lastTask, setLastTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved to local storage:', tasks);
  }, [tasks]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setTaskTime(new Date().toLocaleString());
    setShowModal(true);
  };

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: taskName,
      time: taskTime,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setLastTask(newTask);
    setTaskName('');
    setTaskTime('');
    setShowModal(false);
    console.log('Task added:', newTask);

    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const undoAddTask = () => {
    if (lastTask) {
      setTasks(tasks.filter(task => task.id !== lastTask.id));
      setShowMessage(false);
      console.log('Undo task:', lastTask);
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    console.log('Task deleted, new tasks list:', updatedTasks);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const t = translations[language];

  return (
    <div className={`container mt-5 ${language === 'AR' ? 'rtl' : ''}`}>
      <div className="d-flex flex-column align-items-center mb-3">
        <div className="d-flex align-items-center w-50">
          <input
            type="text"
            className="form-control"
            placeholder={t.searchPlaceholder}
            style={{ marginRight: language === 'EN' ? '10px' : '0', marginLeft: language === 'AR' ? '10px' : '0' }}
            onChange={handleSearchChange}
          />
          <button className="btn button1" onClick={handleShow}>{t.addTaskButton}</button>
          <div className="d-flex align-items-center ms-4">
            <span>EN</span>
            <label className="switch ml-2 mr-2">
              <input type="checkbox" onChange={() => setLanguage(language === 'EN' ? 'AR' : 'EN')} />
              <span className="slider round"></span>
            </label>
            <span>AR</span>
          </div>
        </div>
      </div>
      <div className="list-group">
        {filteredTasks.map(task => (
          <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center task-card">
            <div>
              <h4 className='font-weight-bold'>{t.taskTitle}{task.id}</h4>
              <h4 className='font-weight-bold'>{t.taskName}: {task.name}</h4>
              <h4 className='font-weight-bold'>{t.taskTime}: {task.time}</h4>
            </div>
            <button className="btn text-danger" onClick={() => deleteTask(task.id)}>{t.deleteButton}</button>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t.newTaskModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t.newTaskModalBody}</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t.taskNameLabel}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t.taskNameLabel}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t.taskTimeLabel}</Form.Label>
              <Form.Control
                type="text"
                placeholder="--:-- AM"
                value={taskTime}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t.closeButton}
          </Button>
          <Button variant="success" onClick={addTask}>
            {t.createTaskButton}
          </Button>
        </Modal.Footer>
      </Modal>

      {showMessage && (
        <Notification 
          message={t.taskAddedMessage} 
          onUndo={undoAddTask} 
          onClose={() => setShowMessage(false)} 
        />
      )}
    </div>
  );
};

export default App;
