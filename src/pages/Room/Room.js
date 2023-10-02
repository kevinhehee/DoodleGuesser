
import "./Room.css"
import DrawingPage from "../../components/DrawingPage/DrawingPage";
import Chat from "../../components/Chat/Chat";

const Room = () => {

    return (
        <div className = "page">

            <div className = "room-layout">
                <DrawingPage/>
                <Chat/>

            </div>

        </div>
    )

}

export default Room