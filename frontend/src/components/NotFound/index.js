import "./notFound.css";
import notFoundImg from "./404.png"
import { useHistory, } from 'react-router-dom';

export default function NotFound() {

    const history = useHistory();


    return (
        <div className="not-found-container">
            <h1>Page not Found</h1>
             <p className="not-found-p"> Uh oh, we can’t seem to find the page you’re looking for. </p>
           <button
           className="go-to-feed-button"
                onClick={() => history.push(`/`)}
            >Go back to home page</button>
            <img src={notFoundImg}></img>

        </div>
    )

}
