import React from "react"
import LocaleFactory from "../locale/LocaleFactory";

class ChatMessageContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: props.language ? props.language : new LocaleFactory().load(),
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({lang: nextProps.language})
    }

    /**
     * Get background color of chat message.
     * @param {Number}  userRole, 1 for teacher, 2 for student.
     * @param {Number}  messageType, 1 for user message, 2 for channel message.
     */
    getChatBG(userRole, messageType) {
        if (messageType == 1) {
            return 'rgba(102,102,102,1)';
        }
        if (userRole == 1) {
            return 'rgba(0,185,158,1)';
        }

        return 'rgba(102,102,102,1)';
    }

    render() {
        return (
            <div>
                <p style={{
                    fontSize: '14px',
                    paddingTop: '10px',
                    fontFamily: 'PingFangSC-Regular,PingFang SC',
                    fontWeight: 400,
                    color: 'rgba(153,153,153,1)',
                    margin: '0 0 0 8px'
                }}><b>{this.props.role == 1 ? this.state.lang.Me : this.props.userName}</b> {this.props.timeText}</p>
                <p style={{
                       margin: '4px 0 0 8px',
                       borderRadius: '3px',
                       fontSize: '16px',
                       fontFamily: 'PingFangSC-Regular,PingFang SC',
                       fontWeight: 400,
                       color: this.getChatBG(this.props.role, this.props.messageType),
                       wordBreak: 'break-word'
                   }}>{this.props.content}</p>
            </div>
        );
    }
}

export default ChatMessageContent;