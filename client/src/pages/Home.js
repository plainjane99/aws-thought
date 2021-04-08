import React, { useState, useEffect } from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thoughts, setThoughts] = useState([]);

  // const loggedIn = Auth.loggedIn();

  // old code
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // fetch the data and save to res constant
  //     const res = await fetch('/api/users');
  //     // store res as json in data constant
  //     const data = await res.json();
  //     // sort the array by createdAt property ordered by descending values
  //     const orderData = data.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
  //     setThoughts(orderData);
  //     setIsLoaded(true);
  //   }
  //   fetchData();
  // }, []);

  // request all the users' thoughts to render on the component mount event
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch the data and save to res constant
        const res = await fetch('/api/users');
        // store res as json in jsonData constant
        const jsonData = await res.json();
        // sort the array by createdAt property ordered by descending values
        const data = jsonData.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
        // console.log(data);
        // store the data using the useState setter method, setThoughts
        setThoughts([...data]);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          <ThoughtForm />
        </div>
        <div className={`col-12 mb-3 `}>
          {!isLoaded ? (
            <div>Loading...</div>
          ) : (
              <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
            )}
        </div>
      </div>
    </main>
  );
};

export default Home;