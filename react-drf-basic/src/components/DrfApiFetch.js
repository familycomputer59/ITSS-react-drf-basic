import React, {useEffect, useState} from 'react'
import axios from 'axios'

const DrfApiFetch = () => {

  const [tasks, setTasks] = useState([])
  const [editedTask, setEditedTask] = useState({id: "", title: ""})
  const [selectedTask, setSelectedTask] = useState([])
  const [id, setId] = useState(1)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/tasks/',{
      headers: {
        'Authorization': 'Token 0a597b8b240516c219ef3ed90fb39ab2c45be5e3'
      }
    }).then(res => setTasks(res.data))
  },[])

  const getTask = () => {
    axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`,{
      headers: {
        'Authorization': 'Token 0a597b8b240516c219ef3ed90fb39ab2c45be5e3'
      }
    }).then(res => {
      setSelectedTask(res.data)
    })
  }

  const deleteTask = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        headers: {
          Authorization: "Token 0a597b8b240516c219ef3ed90fb39ab2c45be5e3",
        },
      })
      .then((res) => {
        setTasks(tasks.filter((task) => task.id !== id))
        setSelectedTask([])
      })
  }

  const newTask = (task) => {
    const data = {
      title: task.title
    }

    axios.post(`http://127.0.0.1:8000/api/tasks/`, data, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token 0a597b8b240516c219ef3ed90fb39ab2c45be5e3'
      }
    }).then((res) => {
      setTasks([...tasks, res.data])
      setEditedTask({id: "", title: ""})
    })
  }

  const editTask = (task) => {
    axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token 0a597b8b240516c219ef3ed90fb39ab2c45be5e3'
      }
    }).then((res) => {
      setTasks(
        tasks.map((task) => (task.id === editedTask.id ? res.data : task))
      )
      setEditedTask({id: "", title: ""})
    })
  }
  
  const handleInputChange = (evt) => {
    const value = evt.target.value
    const name = evt.target.name
    setEditedTask({ ...editedTask, [name]: value})
  }

  return (
    <>
      <ul>
        {
          tasks.map(task => <li key={task.id}>
            {task.id} : {task.title}
            <button onClick={() => deleteTask(task.id)}>
              <i className='fas fa-trash-alt'></i>
            </button>
            <button onClick={() => setEditedTask(task)}>
              <i className='fas fa-pen'></i>
            </button>
          </li>)
        }
      </ul>
      Set id <br/> 
      <input type="text" value={id} onChange={
        evt => {setId(evt.target.value)}
      } />
      <button type='button' onClick={() => getTask()}>Get Task</button>
      <br/>
      <h3>{selectedTask.id} : {selectedTask.title}</h3>

      <input 
        type="text"
        name="title"
        value={editedTask.title}
        onChange={(evt) => handleInputChange(evt)}
        placeholder="新しいタスク"
        required
      />
      {editedTask.id ? 
      (<button onClick={() => editTask(editedTask)}>更新</button>)
      :
      (<button onClick={() => newTask(editedTask)}>送信</button>)
      }
    </>
  )
}

export default DrfApiFetch