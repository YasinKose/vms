import {useEffect, useState} from 'react';
import {useClientError} from './hooks/useClientError';
import {getProfileInformation} from './HomeManager';
import AppRouter from './router/AppRouter';

function App() {

  return <AppRouter/>
}

export default App;
