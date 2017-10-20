import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {BrowserRouter, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import OrderBook from './components/OrderBook';

const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Navbar/>
        <Route exact path="/" component={Home}/>
        <Route path="/order-book" component={OrderBook}/>
      </div>
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
);
