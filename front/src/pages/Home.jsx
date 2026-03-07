import React from "react";
import Left from "../components/Left";
import Middle from "../components/Middle";
import Right from "../components/Right";


const Home = () => {
  return (
    <div className="flex">
      <Left />
        <Middle />
        <div className='hidden sm:block'>
            <Right />
        </div>


    </div>
  );
};

export default Home;
