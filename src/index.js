import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {Router, Route} from 'react-router-dom'

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import OrderBook from './components/OrderBook';
import history from './history';

import './index.css';

const store = configureStore();



ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Navbar/>
        <Route exact path="/" component={Home}/>
        <Route path="/order-book" component={OrderBook}/>

        <Footer/>
      </div>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
