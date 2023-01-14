import Reac, { useState, useEffect }  from 'react';
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from './components/Spots/GetAllSpots'
import GetSpotDetails from './components/Spots/GetSpotDetails'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <Switch>
         <Route exact path="/">
            <GetAllSpots />
          </Route>
          <Route path="/spots/:spotId">
            <GetSpotDetails />
          </Route>
    </Switch>
    )}
    </>
  );
}

export default App;
