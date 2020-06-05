import React from "react"
import ChatMessageContent from "./ChatMessageContent";
import renderUtils from "../common/RenderUtils";
import LocaleFactory from "../locale/LocaleFactory";

class ChatList extends React.Component {
    scrollDownRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            lang: props.language ? props.language : new LocaleFactory().load(),
            isSendDisabled: true,
            // msgContent: ''
        };
        this.isSending = false;
        this.msgContent = "";
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({lang: nextProps.language})
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            if (!this.isSending) {
                this.isSending = true;
                this.handleSend();
                const that = this;
                setTimeout(function () {
                    that.isSending = false;
                }, 1000);
            }
        }
    }

    toggleSend() {
        let input = document.getElementById('msgContent');

        this.state.isSendDisabled = !input || !input.value || input.value.length === 0;
        this.msgContent = input.value;

        this.setState(this.state);
    }

    handleSend() {
        if (this.state.isSendDisabled) {
            return;
        }

        if (!this.props.MessageSendHandler) {
            console.error("No MessageSendHandler for ChatList, cannot send any message.");
            return;
        }

        let input = document.getElementById('msgContent');
        if (input.value.length > 0) {
            this.props.MessageSendHandler(input.value);
            this.msgContent = "";
        }

    }

    handleMuteAll() {
        if (!this.props.MuteAllHandler) {
            console.error("No MuteAllHandler for ChatList, cannot mute all.");
            return;
        }

        this.props.MuteAllHandler();
    }

    scrollToBottom() {
        if (this.scrollDownRef.current) {
            this.scrollDownRef.current.scrollIntoView({behavior: "smooth"});
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div id="ChatList" className="tile is-vertical"
                 style={{
                     display: this.props.visible ? "" : "none",
                     Width: "307px",
                     height: window.innerHeight - 60 - 161 - 50,
                     maxHeight: window.innerHeight - 60 - 161 - 50,
                     flexDirection: 'column'
                 }}>
                <div style={{
                    display: 'flex',
                    background: 'rgba(245,245,245,1)',
                    flexWrap: 'nowrap',
                    flexDirection: 'row-reverse'
                }}>
                    <img src={renderUtils.getImage("/images/userdiscuss/notice_edit.png")}
                         style={{
                             display: "none",
                             width: '12px',
                             height: '12px',
                             margin: '13px 10px 15px 8px'
                         }}
                    />
                    <p style={{
                        width: 'auto',
                        height: '22px',
                        flex: 2,
                        display: 'block',
                        color: 'rgba(153,153,153,1)',
                        alignContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        wordBreak: 'break-all',
                        margin: '0px 0px 0px 8px',
                        lineHeight: '22px',
                        fontWeight: 400,
                        overflowWrap: 'break-word',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        position: 'relative',
                        whiteSpace: 'nowrap'
                    }}>
                        {this.state.lang.ClassNoteTitle}{this.props.ClassNote}
                    </p>
                </div>

                <div id='chatBox'
                     style={{
                         overflowY: 'auto',
                         height: window.innerHeight - 60 - 161 - 50 - 40 - 10 - 40,
                         position: 'relative',
                         top: 0,
                         width: '100%'
                     }}>
                    {
                        this.props.ChatMessages ?
                            this.props.ChatMessages.map((msg, index) => (
                                <ChatMessageContent
                                    language={this.state.lang}
                                    key={"ChatMessageItem" + index} userName={msg.fromUserName}
                                    timeText={msg.sendTimeText}
                                    role={msg.fromUserRole}
                                    messageType={msg.fromType}
                                    content={msg.content}>
                                </ChatMessageContent>
                            ))
                            : ""
                    }

                    <div style={{
                        width: '100%',
                        height: '24px',
                    }}
                        ref={this.scrollDownRef}></div>
                </div>

                <div className='level' style={{
                    height: 'fit-content',
                    width: '307px',
                    display: 'flex',
                    position: 'absolute',
                    bottom: '10px',
                    background: 'rgba(255,255,255,1)'
                }}>
                    <input className="input" id="msgContent" type="text"
                           onKeyUp={this.handleKeyPress.bind(this)}
                           placeholder={this.state.lang.DiscussPlaceHolder}
                           onChange={e => this.toggleSend(e.currentTarget.value)}
                           value={this.msgContent} style={{
                        height: '40px',
                        width: '190px',
                        flex: '1',
                        margin: "0 0 0 7px",
                        background: 'rgba(245,245,245,1)',
                        borderRadius: '8px'
                    }}/>
                    <a className="buttonCommon"
                       onClick={this.handleSend.bind(this)}
                       disabled={this.state.isSendDisabled}
                       style={{
                           display: 'inline-block',
                           width: '55px',
                           height: '40px',
                           lineHeight: '40px',
                           padding: '0 0 0 0',
                           'margin': '0px 8px 0 8px'
                       }}>{this.state.lang.Send}</a>
                </div>
            </div>
        );
    }
}

export default ChatList;