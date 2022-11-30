import "./App.css";
import Canvas from "containers/Canvas";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Review from "containers/Review";
function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Canvas />} />
          <Route exact path='/share' element={<Review />} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
