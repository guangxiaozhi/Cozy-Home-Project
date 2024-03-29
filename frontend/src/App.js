import Reac, { useState, useEffect }  from 'react';
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from './components/Spots/GetAllSpots';
import GetSpotDetails from './components/Spots/GetSpotDetails';
import CreateNewSpot from './components/Spots/CreateNewSpot';
import EditSpot from './components/Spots/EditSpot';
import CreateNewReview from './components/Reviews/CreateNewReview'
import NotFound from './components/NotFound';
import Footer from './components/Footer';

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
      <>
        <Switch>
          <Route exact path="/">
              <GetAllSpots />
            </Route>
            <Route  path="/spots/newSpot">
              <CreateNewSpot />
            </Route>
            <Route exact path="/spots/:spotId/edit">
              <EditSpot />
            </Route>
            <Route exact path="/spots/:spotId/reviews">
              <CreateNewReview />
            </Route>
            <Route exact path="/spots/:spotId">
              <GetSpotDetails />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
      </Switch>
      <Footer />
    </>
    )}
    </>
  );
}

export default App;
