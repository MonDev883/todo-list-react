import React, {useContext} from "react";
import { UserContext } from "./ComponentA.jsx";

function componentD(){

    const user = useContext(UserContext);

    return(<div className="box">
                <h1>ComponentD</h1>
                <h2>{`A Blessed Morning ${user}`}</h2>
           </div>);
}
export default componentD