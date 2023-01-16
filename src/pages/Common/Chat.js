import React, { Component, useState } from "react"
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import $ from "jquery"

const Chat = ({chatStatus}) => {
    require("../../assets/css/chat.css")

    const [user, setUser] = useState("")
    const [room, setRoom] = useState("")
    const [messages, setMessages] = useState([])
    const [messageValue, setMessagesValue] = useState([])
    const [connection, setConnection] = useState();
    const [newPayload, setNewPayload] = useState(JSON.parse(localStorage.getItem("user")));


    const joinRoom = async (user, room) => {
        try {
            const connection = new HubConnectionBuilder()
            //.withUrl("http://localhost/chat")
            .withUrl("https://backendyabatechelearning.lloydant.com/chat")
            //.withUrl("https://localhost:44303/chat")
            .configureLogging(LogLevel.Information)
            .build();
            connection.on("ReceiveMessage", (user, message) => {
                console.log('message recieved: ', message)
                setMessages(messages => [...messages, {user, message}])
                console.log('messagesssssss: ', messages)
            });
            await connection.start();
            await connection.invoke("JoinRoom", {user, room})
            setConnection(connection)
        }
        catch (e) {
            console.log(e)
        }
    }

    const sendMessage = async () => {
        try{
            await connection.invoke("SendMessage", messageValue)
        }
        catch(e){
            console.log(e)
        }
    }
    // fullName
const triggerChat = () => {
    joinRoom(newPayload?.fullName, " ")
    $("#msgSection").fadeIn()
}
    return (
        <>
         <div className="row text-center container">
               <div className="col-sm-12">
               <button className="btn " onClick={() => triggerChat()}>Click here to enter chat room</button>

               </div>
                </div>
            <section className="msger mt-4" style={{display:"none"}} id="msgSection">
               
                <header className="msger-header">
                    <div className="msger-header-title">
                        <i className="fas fa-comment-alt" /> E-Chat/Discussion Board
                    </div>
                    <div className="msger-header-options">
                        <span><i className="fas fa-cog" /></span>
                    </div>
                </header>
                <main className="msger-chat">
                    {messages.map((x, i) => {
                        return(
                            <>
                            <div className={x.user == newPayload.fullName ? "msg right-msg" : "msg left-msg"} key={i}>
                               
                                <div className="msg-bubble">
                                    <div className="msg-info">
                                        <div className="msg-info-name">{x.user}</div>
                                        <div className="msg-info-time">12:45</div>
                                    </div>
                                    <div className="msg-text">
                                       {x.message}
                                    </div>
                                </div>
                    </div>
                            </>
                        )
                    })}
                    {/* <div className="msg right-msg">
                        <div className="msg-img" style={{ backgroundImage: 'url(https://image.flaticon.com/icons/svg/145/145867.svg)' }} />
                        <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-name">Sajad</div>
                                <div className="msg-info-time">12:46</div>
                            </div>
                            <div className="msg-text">
                                You can change your name in JS section!
                            </div>
                        </div>
                    </div> */}
                </main>
                <form className="msger-inputarea">
                    <input onChange={(e) => setMessagesValue(e.target.value)} type="text" className="msger-input" placeholder="Enter your message..." />
                    <button type="button" onClick={() => sendMessage()} className="msger-send-btn">Send</button>
                </form>
            </section>

        </>
    )
}


export default Chat;
