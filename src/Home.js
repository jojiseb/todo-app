import React , {useState,useEffect} from "react";
import {Navigate} from 'react-router-dom';
import db from './firebase-config';
import { doc, addDoc , updateDoc, collection,onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";


function Home({ user})
{
  const [task,setTask] = useState('');
  const [description,setDescription] = useState("");
  const [todos,setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const send = async (e) => {
    console.log("pressed")
    e.preventDefault();
    await addDoc(collection(db,'todos'),{
      task: task,
      description: description, 
      isFavourite: false,
      isComplete: false, 
      isDelete: false,
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
    })
    return () => unsub();
  },[]);

  useEffect(() => {
    if (todos.length) {
      refreshList(activeFilter);
    }
  }, [todos]);


  const handleDelete = async (id, previousState) => {
    const taskDocRef = doc(db, 'todos', id)
    try 
    {
      await updateDoc(taskDocRef, {isDelete: !previousState})
    } catch (error) {
        alert(error)
    }
  }

  const toggleFavourite = async (id, previousState) => {
    const favDocRef = doc(db, 'todos', id)
    try 
    {
      await updateDoc(favDocRef, {isFavourite: !previousState});
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

  const refreshList = (action) => {
    if (action === "all") {
      setFilteredTodos(todos.filter(todo => !todo.isDelete))
    }
    if (action === "isComplete") {
      listOfCompleted();
    } else if( action === "isFavourite") {
      listOfFavourites();
    } else if ( action === "isDelete") {
      listOfDeleted();
    }
  }

   const listOfFavourites = () => {
          setFilteredTodos(todos.filter(todo => todo.isFavourite && !todo.isDelete))
   }

   const listOfCompleted = () => {
      setFilteredTodos(todos.filter(todo => todo.isComplete && !todo.isDelete))
   }

   const listOfDeleted = () => {
      setFilteredTodos(todos.filter(todo => todo.isDelete));
   }

   const search = (searchText) => {
    setFilteredTodos(todos.filter(todo => todo.task.toLowerCase().includes(searchText.toLowerCase())))
   };

  if(!user) {
    return <Navigate to="/signin" replace={true}/>
  }

  return(
        <div className="dashboard">
          <svg className="design"width="44" height="66" viewBox="0 0 44 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.8014 0.00107963C20.3383 0.00179549 17.9764 0.979076 16.2347 2.71809C14.4931 4.45709 13.5143 6.81551 13.5136 9.27482V13.4877H9.29431C8.07373 13.4867 6.86492 13.726 5.73705 14.192C4.6092 14.6579 3.58443 15.3414 2.72137 16.2032C1.85831 17.0649 1.17391 18.0882 0.707315 19.2144C0.240727 20.3406 0.00111195 21.5476 0.00217905 22.7663V32.0368H13.5114V40.4626H9.29214C6.82838 40.4622 4.46538 41.4391 2.72282 43.1782C0.980269 44.9173 0.000860639 47.2761 0 49.7362V65.758H9.29649C10.5159 65.7575 11.7232 65.5172 12.8496 65.0504C13.976 64.584 14.9992 63.9004 15.861 63.0391C16.7228 62.1777 17.4061 61.1551 17.8721 60.0298C18.3381 58.9044 18.5775 57.6989 18.5767 56.4814H18.5886V50.3604L18.5637 50.3637V11.3678L18.5843 11.3726V9.27644C18.5864 8.15872 19.0313 7.08721 19.8218 6.2958C20.6122 5.50439 21.6841 5.05735 22.8036 5.0522H38.9391V9.27644C38.9356 10.3937 38.4892 11.464 37.6976 12.2535C36.9059 13.043 35.8333 13.4873 34.7144 13.4893H20.4938V18.5459H34.7122C37.1753 18.546 39.5375 17.5692 41.2793 15.8304C43.0211 14.0915 43.9997 11.7331 44 9.27375V0L22.8014 0.00107963ZM13.5136 26.9797H5.07179V22.7668C5.07365 21.6478 5.51902 20.575 6.31067 19.7828C7.10226 18.9907 8.17576 18.5436 9.29649 18.5394H13.5158L13.5136 26.9797ZM13.5136 56.486C13.5117 57.6031 13.0667 58.6742 12.276 59.4643C11.4853 60.2548 10.4131 60.7003 9.29431 60.7031H5.06962V49.7389C5.07064 48.621 5.51624 47.5493 6.30844 46.7593C7.10069 45.9692 8.17465 45.5257 9.29431 45.5261H13.5136V56.486ZM20.4938 32.0362H31.1502V36.2534C31.146 37.3705 30.6994 38.4404 29.9079 39.2298C29.1164 40.0191 28.0442 40.4636 26.9255 40.4663H20.4938V45.5261H26.9276C28.1475 45.5267 29.3556 45.2873 30.4827 44.8215C31.6098 44.3557 32.634 43.6726 33.4965 42.8113C34.3591 41.95 35.0432 40.9274 35.5098 39.802C35.9763 38.6766 36.2161 37.4704 36.2155 36.2524H36.2198V26.9786H20.4938V32.0362Z" fill="#00314F"/>
          </svg>

          <div className="dashboard_left">
            <div className="dashboard_left_item">
              <h1>TODO</h1>
            </div>
            <div className="dashboard_left_item">
              <h3>Welcome to TODO , where you arrange your daily reminders/stuff to do</h3>
            </div>
            <div className="dashboard_left_item">
              <input type="text"placeholder="Title"width='378px'height='64px'value={task} onChange={(e) => setTask(e.target.value)}/>
            </div>
            <div className="dashboard_left_item">
              <input type='text'placeholder="Description"width='378px'height='64px'value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <button className="dashboard_left_item add_button" disabled={!task} type="submit"onClick={send}>Add</button>
          </div>
          <div className="divider"></div>
          <div className="dashboard_right">
            <div className="dashboard_right_item">
              <h1>TODO LIST</h1>
            </div>
            <div className="dashboard_top_action_bar">
              <div>
                <label>
                  <input type="text" placeholder="Search" onChange={(e) => search(e.target.value)}/>
                </label>
              </div>
              <div>
                  <select placeholder="Filter by" onChange={(e) => { 
                    const action = e.target.value;
                    refreshList(action);
                    setActiveFilter(action);
                  }}>
                    <option value="all" selected>{"all"}</option>
                    <option value="isComplete" >{"Completed"}</option>
                    <option value="isFavourite">{"Favourites"}</option>
                    <option value="isDelete" >{"Deleted"}</option>
                  </select>
              </div>
            </div>
            <div className="dashboard_list_container">
              <ul>
                {filteredTodos.map(({task,description,id, isFavourite=false, isComplete=false, isDelete=false}) =>{
                  return (
                    <div key={id}>
                      <div className="list_item_container">
                        <div className="card_content">
                          <h1 className={isComplete ? "strikethrough" : ""}>{task}</h1>
                          <p className={isComplete ? "strikethrough" : ""}>{description}</p>
                        </div>
                        <div className="action_container">
                          <div 
                            className="favourite_button"
                            onClick={() => toggleFavourite(id, isFavourite)}>
                            {isFavourite ? 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}><path fill="none" d="M0 0H24V24H0z" /><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" /></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}><path fill="none" d="M0 0H24V24H0z" /><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" /></svg>}
                          </div>
                          <div>
                     {!isDelete && <button onClick={() => handleDelete(id, isDelete)}>Delete</button>}
                      <button className="complete_button" onClick={() => toggleComplete(id, isComplete)}>
                        {isComplete ? 
                        "Completed"
                        :
                        "Complete"}
                      </button>
                     </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          </div>
            {/*<h1>Things to do...</h1>
            <br/>
            <br/>
            <div>
              <label>Task</label><br/><br/>
                <input type='text' placeholder="Enter the task" value={task} onChange={(e) => setTask(e.target.value)}/>
                <br/><br/>
              <label>Description</label><br/><br/>
                <input type='text' placeholder="Describe what to do" value={description} onChange={(e) => setDescripti?{isCompleteFilterEnabled ? "Disable  Completed Filter": "Show only Completed"}</button>
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
                    </li>
                  );
                })}
              </ul>*/}
        </div>
    );
}

export default Home;