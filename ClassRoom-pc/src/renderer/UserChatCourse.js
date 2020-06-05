import React from "react"
import CoursewareList from "./CoursewareList";
import ChatList from "./ChatList";
import StudentList from "./StudentList";
import renderUtils from "../common/RenderUtils"
import LocaleFactory from "../locale/LocaleFactory";

class UserChatCourse extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pageIndex: 0,
            lang: this.props.language ? this.props.language : new LocaleFactory().load(),
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({lang: nextProps.language})
    }

    switchPage(pageIndex) {
        this.state.pageIndex = pageIndex;
        this.setState(this.state);
    }

    render() {
        return ((
            <div style={{
                width: "307px",
                height: 'auto',
                display: 'flex',
                flex: 1,
                flexDirection: 'column'
            }}>
                <div style={{
                    display: 'flex',
                    borderStyle: 'none none solid',
                    borderWidth: "1px",
                    borderColor: '#F7F7F7'
                }}>
                    <a onClick={this.switchPage.bind(this, 0)}
                       className="is-info is-small userChatTab" id='startBtn'
                       disabled={this.state.pageIndex == 0}
                    >{this.state.lang.Course}</a>
                    <a onClick={this.switchPage.bind(this, 1)}
                       className="userChatTab" id='stopBtn'
                       disabled={this.state.pageIndex == 1}>{this.state.lang.Discuss}</a>
                    <a onClick={this.switchPage.bind(this, 2)}
                       className="userChatTab" id='stopBtn'
                       disabled={this.state.pageIndex == 2}
                       style={{
                           display: 'flex',
                           justifyContent: 'center',
                           textAlign: 'center',
                           alignItems: 'center'
                       }}
                    ><img style={{
                        width: '16px',
                        height: '16px'
                    }}
                          src={renderUtils.getImage(this.state.pageIndex == 2 ? "/images/userdiscuss/user_chat_student_selected.png" : "/images/userdiscuss/user_chat_student.png")}
                    />({this.props.Students ? this.props.Students.length : 0})</a>
                </div>
                <div style={{
                    height: window.innerHeight - 60 - 161 - 50,
                    position: 'relative'
                }}>
                    <div
                        id="StudentMsg"
                        style={{
                            position: "absolute",
                            display: "none",
                            justifyContent: "center",
                            alignItems: "center",
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            zIndex: '201',
                            margin: "auto",
                            width: 'fit-content',
                            height: '48px',
                            background: 'rgba(0,0,0,1)',
                            borderRadius: '6px',
                            opacity: '0.7'
                        }}>
                        <p
                            id="StudentMsgContnt"
                            style={{
                                height: 'fit-conent',
                                fontSize: '16px',
                                margin: '0 28px 0 28px',
                                fontFamily: 'PingFangSC-Regular,PingFang SC',
                                fontWeight: '400',
                                color: 'rgba(255,255,255,1)',
                                lineHeight: '22px'
                            }}></p>
                    </div>
                    <CoursewareList
                        isPlaying={this.props.isPlaying}
                        playMusic={this.props.playMusic.bind(this)}
                        onCourseWareItemClick={this.props.onCourseWareItemClick.bind(this)}
                        language={this.state.lang}
                        room={this.props.room}
                        images={this.props.images}
                        visible={this.state.pageIndex === 0}> </CoursewareList>
                    <ChatList
                        language={this.state.lang}
                        isMuteAll={this.props.isMuteAll}
                        MuteAllHandler={this.props.toggleMuteAll}
                        visible={this.state.pageIndex === 1}
                        ClassNote={this.props.ClassNote}
                        ChatMessages={this.props.ChatMessages}
                        MessageSendHandler={this.props.MessageSendHandler}/>
                    <StudentList
                        toggleMuteAll={this.props.toggleMuteAll.bind(this)}
                        language={this.state.lang}
                        visible={this.state.pageIndex === 2}
                        Students={this.props.Students}
                        isMuteAll={this.props.IsStudentMuteAll}
                        MuteCheckHandler={this.props.MuteCheckHandler}
                        MuteToggleHandler={this.props.MuteToggleHandler}
                        HandingCheckHandler={this.props.HandingCheckHandler}
                        TalkingCheckHandler={this.props.TalkingCheckHandler}
                        AgreeTalkHandler={this.props.AgreeTalkHandler}
                        RejectTalkHandler={this.props.RejectTalkHandler}
                    />
                </div>
            </div>
        ));
    }
}

export default UserChatCourse;