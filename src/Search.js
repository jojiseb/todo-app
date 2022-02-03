//  import React, { useEffect, useState } from 'react';
//  import { useLocation} from 'react-router-dom';
//  import db from './firebase-config';

//  const Search = () => {
//      const [data, setData] = useState({});

//      const useQuery = () => {
//          return new URLSearchParams(useLocation().search);
//      }

//      let query = useQuery();
//      let search = query.get("name");
//      console.log("Search",search);

//      useEffect(() => {
//        searchData();
//      }, [search])

//      const searchData = () => {
//          db.child("todos").orderByChild('name').equalTo(search).on('value', (snapshot) => {
//              if(snapshot.val()) 
//              {
//                  const data = snapshot.val();
//                  setData(data);
//              }
//          })
//      }

//    return (
//    <>
//        <li key={id}>
//        <div className="list_item_container">
//          <div className="card_content">
//            <h1>{task}</h1>
//            <p>{description}</p>
//          </div>
//        </div>
//        </li>
//    </>
//    );
//  }

//  export default Search;
