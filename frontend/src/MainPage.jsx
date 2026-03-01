import React from 'react'
import Navbar01 from './Navbar01';
import Welcome from './Welcome';
import Features from './Features';
import Popularauthors from './Popularauthors';

function MainPage() {
  return (
    <div>
      <Navbar01 />
      <Welcome />
      <Features /> 
      <Popularauthors />
    </div>
  );
}

export default MainPage
