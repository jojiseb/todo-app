import React , {useState,useEffect} from "react";
import {Navigate,useNavigate} from 'react-router-dom';
import db from './firebase-config';
import { doc, addDoc , updateDoc, deleteDoc ,collection,onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";

function Home({ user })
{
  const [task,setTask] = useState('');
  const [description,setDescription] = useState("");
  const [todos,setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isFavouriteFilterEnabled, setIsFavouriteFilterEnabled] = useState(false);
  const [isCompleteFilterEnabled, setIsCompleteFilterEnabled] = useState(false);
  const [search,setSearch] = useState('');

  const navigate = useNavigate();

  const send = async (e) => {
    e.preventDefault();
    await addDoc(collection(db,'todos'),{
      task: task,
      description: description, 
      isFavourite: false,
      isComplete: false, 
      timestamp: serverTimestamp()
    })   

    setTask("");
    setDescription("");
  }

  useEffect(() => {
    const q = query(collection(db,'todos'), orderBy('timestamp','asc'));
    const unsub = onSnapshot(q,(todos) => {
      let todosArray = [];
      todos.forEach((doc) => {
        console.log(doc);
        todosArray.push({...doc.data(), id: doc.id});
      })
      setTodos(todosArray);
      setFilteredTodos(todosArray);
    })
    return () => unsub();
  },[]);


  const handleDelete = async (id) => {
    const taskDocRef = doc(db, 'todos', id)
    try 
    {
      await deleteDoc(taskDocRef)
    } catch (error) {
        alert(error)
    }
  }

  const toggleFavourite = async (id, previousState) => {
    const favDocRef = doc(db, 'todos', id)
    try 
    {
      await updateDoc(favDocRef,{isFavourite: !previousState});
      console.log("Favourited")
    } catch (error) {
        alert(error)
    }
  }

  const  toggleComplete = async (id, previousState) => {
    const completedDocRef = doc(db, 'todos', id)
    try 
    {
      await updateDoc(completedDocRef,{isComplete: !previousState});
      console.log("Completed")
    } catch (error) {
        alert(error)
    }
  }

   const listOfFavourites = () => {
        if (isFavouriteFilterEnabled) {
          setFilteredTodos(todos);
          setIsFavouriteFilterEnabled(false)
        } else {
          setFilteredTodos(todos.filter(todo => todo.isFavourite))
          setIsFavouriteFilterEnabled(true)
          setIsCompleteFilterEnabled(false)
        }
   }

   const listOfCompleted = () => {
    if (isCompleteFilterEnabled) {
      setFilteredTodos(todos);
      setIsCompleteFilterEnabled(false)
    } else {
      setFilteredTodos(todos.filter(todo => todo.isComplete))
      setIsCompleteFilterEnabled(true)
      setIsFavouriteFilterEnabled(false)

    }
   }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?name=${search}`)
    setSearch('');
  }

  if(!user) {
    return <Navigate to="/signin" replace={true}/>
  }

  return(
        <div className="main">
            <h1>Things to do...</h1>
            
            <form onSubmit={handleSubmit} style={{display: "inline"}}>
              <input 
                type='text'
                className="searchField"
                placeholder="Search title..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}/>
              </form>
            <br/>
            <br/>
            <div>
              <label>Task</label><br/><br/>
                <input type='text' placeholder="Enter the task" value={task} onChange={(e) => setTask(e.target.value)}/>
                <br/><br/>
              <label>Description</label><br/><br/>
                <input type='text' placeholder="Describe what to do" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <br/><br/>
                <button disabled={!task} type='submit'onClick={send}>Add Todo</button>&nbsp;
                <button style={{justifyContent: "right"}}>Sign Out</button>&nbsp;
                <button onClick={listOfCompleted}>{isCompleteFilterEnabled ? "Disable  Completed Filter": "Show only Completed"}</button>
                <button onClick={listOfFavourites}>{isFavouriteFilterEnabled ? "Disable Favorites Filter": "Show only favorites"}</button>
            </div>

            <ul>
                {filteredTodos.map(({task,description,id, isFavourite=false, isComplete=false}) =>{
                  return (
                    <li key={id}>
                      <div className="list_item_container">
                        <div className="card_content">
                          <h1 className={isComplete ? "strikethrough" : ""}>{task}</h1>
                          <p className={isComplete ? "strikethrough" : ""}>{description}</p>
                        </div>
                        <div className="actions_container">
                          <div 
                            className="favourite_button"
                            onClick={() => toggleFavourite(id, isFavourite)}>
                            {isFavourite ? 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}><path fill="none" d="M0 0H24V24H0z" /><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" /></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}><path fill="none" d="M0 0H24V24H0z" /><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" /></svg>}
                       </div>
                     <div>
                     <button onClick={() => handleDelete(id)}>Delete</button>
                     &nbsp;
                      <button className="complete_button" onClick={() => toggleComplete(id, isComplete)}>
                        {isComplete ? 
                        "Completed"
                        :
                        "Complete"}
                      </button>
                     </div>
                      </div>
                      </div>
                   
                      {/*<button onClick={() => handleDelete(id)}>Delete</button>
                     
                      <button className="complete_button" onClick={() => toggleComplete(id, isComplete)}>
                        {isComplete ? 
                        "Completed"
                        :
                        "Complete"}
                        </button>*/}
                    </li>
                  );
                })}
            </ul>
        </div>
    );
}

export default Home;