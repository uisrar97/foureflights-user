import './App.css';
/* eslint import/no-webpack-loader-syntax: off */
import Appdata from './containers/App';

// import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import { Provider } from 'react-redux';
import history from './utils/history';
import { PersistGate } from 'redux-persist/integration/react';
import LanguageProvider from './containers/LanguageProvider';
import configureStore from './configureStore';

// New Image imports for new Template
import '!file-loader?name=[name].[ext]!./assets/img/favlogo.webp';
import '!file-loader?name=[name].[ext]!./assets/img/logo.webp';
import '!file-loader?name=[name].[ext]!./assets/img/plane.png';


// Test Images
import '!file-loader?name=[name].[ext]!./assets/img/test/hotels/hotels-1.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/hotels/hotels-2.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/hotels/hotels-3.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/tours/tours-1.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/tours/tours-2.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/tours/tours-3.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/tours/tours-4.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/room-gallery/room-gallery-1.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/room-gallery/room-gallery-2.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/room-gallery/room-gallery-3.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/room-blog/room-blog-1.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/room-blog/room-blog-2.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/test/room-blog/room-blog-3.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/com.jpg';
import '!file-loader?name=[name].[ext]!./assets/img/no-image.png';
import '!file-loader?name=[name].[ext]!./assets/img/icons/adults.svg';
import '!file-loader?name=[name].[ext]!./assets/img/icons/children.svg';
import '!file-loader?name=[name].[ext]!./assets/img/icons/bed.svg';



const initialState = {};
const {persistor, store} = configureStore(initialState, history);
// const MOUNT_NODE = document.getElementById('app');

function App(mesage) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider messages={mesage}>
          {/* <ConnectedRouter history={history}> */}
            <Appdata />
          {/* </ConnectedRouter> */}
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
