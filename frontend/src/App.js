import Reac, { useState, useEffect }  from 'react';
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from './components/Spots/GetAllSpots';
import GetSpotDetails from './components/Spots/GetSpotDetails';
import CreateNewSpot from './components/Spots/CreateNewSpot';
import EditSpot from './components/Spots/EditSpot';

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
          <Route exact path="/spots/newSpot">
            <CreateNewSpot />
          </Route>
          <Route path="/spots/:spotId">
            <GetSpotDetails />
          </Route>
          <Route exact path="/Spots/:SpotId/edit">
            <EditSpot />
          </Route>
    </Switch>
    )}
    </>
  );
}

export default App;
