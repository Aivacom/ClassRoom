import React from "react"
import NetworkStatusButton from "./NetworkStatusButton";
import renderUtils from "../common/RenderUtils";
import LocaleFactory from "../locale/LocaleFactory";

class StudentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.language ? props.language : new LocaleFactory().load(),
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({lang: nextProps.language})
    }

    isWorkWell() {
        return this.props.MuteCheckHandler
            && this.props.MuteToggleHandler

            && this.props.HandingCheckHandler

            && this.props.TalkingCheckHandler
            && this.props.AgreeTalkHandler
            && this.props.RejectTalkHandler;
    }

    isMute(studentId) {
        let mute = this.props.MuteCheckHandler
            ? this.props.MuteCheckHandler(studentId)
            : true;

        let m0 = document.getElementById('mute0_' + studentId);
        if (m0) {
            m0.style.display = mute ? 'none' : '';
        }
        let m1 = document.getElementById('mute1_' + studentId);
        if (m1) {
            m1.style.display = mute ? '' : 'none';
        }

        return mute;
    }

    toggleMute(studentId) {
        if (this.props.MuteToggleHandler) {
            this.props.MuteToggleHandler(studentId);
        }
    }

    isHanding(studentId) {
        let hand = this.props.HandingCheckHandler
            ? this.props.HandingCheckHandler(studentId)
            : false;

        return hand;
    }

    isTalking(studentId) {
        let talking = this.props.TalkingCheckHandler
            ? this.props.TalkingCheckHandler(studentId)
            : false;

        if (talking) {
            let h1 = document.getElementById('mike1_' + studentId);
            if (h1) {
                h1.style.display = talking ? '' : 'none';
            }
        }

        return talking;
    }

    agreeUserTalk(studentId) {
        if (this.props.AgreeTalkHandler) {
            this.props.AgreeTalkHandler(studentId);
        }
    }

    rejectUserTalk(studentId) {
        if (this.props.RejectTalkHandler) {
            this.props.RejectTalkHandler(studentId);
        }
    }

    render() {
        return (

            <div style={{
                position: "relative",
                display: this.props.visible ? "flex" : "none",
                flexDirection: "column-reverse",
                height: window.innerHeight - 60 - 161 - 50 - 2,
                flex: '1',
                maxHeight: window.innerHeight - 60 - 161 - 50 - 2,

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
                <div className='level' style={{
                    height: 'fit-content',
                    display: 'flex',
                    bottom: '10px',
                    flexDirection: "row-reverse",
                    background: 'rgba(255,255,255,1)'
                }}>
                    <a className="buttonCommon"
                       onClick={this.props.toggleMuteAll.bind(this)}
                       style={{
                           display: 'inline-block',
                           width: 'fit-content',
                           height: '40px',
                           lineHeight: '40px',
                           fontSize: '16px',
                           fontFamily: 'PingFangSC-Regular,PingFang SC',
                           fontWeight: '400',
                           color: 'rgba(255,255,255,1)',
                           padding: '0 10px 0 10px',
                           'margin': '0px 8px 9px 0'
                       }}>{this.props.isMuteAll ? this.state.lang.ChatEnable : this.state.lang.ChatDisable}</a>
                </div>
                <div style={{
                    flex: 1,
                    display: "flex",
                    height: '100%',
                    overflowY: 'auto',
                    flexDirection: "column",
                }}
                >
                    {
                        this.props.Students == null
                            ? null
                            : this.props.Students.map((student, index) => (
                                <div key={"uid-" + student.uid}>
                                    <div className="level"
                                         style={{
                                             borderStyle: "none none solid",
                                             borderColor: '#F1F1F1',
                                             borderWidth: "1px",
                                             height: '50px',
                                             padding: '12px'
                                         }}
                                    >
                                        <p className="level-item" style={{
                                            width: "20px",
                                            height: "auto",
                                            marginLeft: "5px",
                                            display: "block",
                                            textAlign: 'start',
                                            wordBreak: "break-all",
                                            fontSize: '16px',
                                            fontFamily: 'PingFangSC-Regular,PingFang SC',
                                            fontWeight: '400',
                                            color: 'rgba(102,102,102,1)'
                                        }}>{student.nickName ? student.nickName : "uid:" + student.uid}</p>

                                        <NetworkStatusButton
                                            isUser={true}
                                            ImageIndex={(student.networkQuality) == null ? 0 : student.networkQuality}
                                            style={{width: '21px', height: '14px'}}/>

                                        <img id={"mike0_" + student.uid}
                                             onClick={this.agreeUserTalk.bind(this, student.uid)}
                                             src={renderUtils.getImage("/images/userchat/user_unconnect.png")}
                                             style={{
                                                 marginLeft: '5px',
                                                 width: "40px",
                                                 height: "40px",
                                                 display: this.isHanding(student.uid) ? "" : "none"
                                             }}/>
                                        <img id={"mike1_" + student.uid}
                                             onClick={this.rejectUserTalk.bind(this, student.uid)}
                                             src={renderUtils.getImage("/images/userchat/user_connected.png")}
                                             style={{
                                                 marginLeft: '5px',
                                                 width: "40px",
                                                 height: "40px",
                                                 display: this.isTalking(student.uid) ? "" : "none"
                                             }}/>

                                        <img id={"mute0_" + student.uid} onClick={this.toggleMute.bind(this, student.uid)}
                                             disabled={this.props.isMuteAll}
                                            // src={renderUtils.getImage(this.isMute(student.uid) ? "/images/userchat/mute_enable.png" : "/images/userchat/mute_disble.png")}
                                             src={renderUtils.getImage("/images/userchat/mute_disble.png")}
                                             style={{
                                                 marginLeft: '5px',
                                                 width: "40px",
                                                 height: "40px",
                                                 display: this.isMute(student.uid) ? "none" : ""
                                             }}/>

                                        <img id={"mute1_" + student.uid} onClick={this.toggleMute.bind(this, student.uid)}
                                            // src={renderUtils.getImage(this.isMute(student.uid) ? "/images/userchat/mute_enable.png" : "/images/userchat/mute_disble.png")}
                                             src={renderUtils.getImage("/images/userchat/mute_enable.png")}
                                             disabled={this.props.isMuteAll}
                                             style={{
                                                 marginLeft: '5px',
                                                 width: "40px",
                                                 height: "40px",
                                                 display: this.isMute(student.uid) ? "" : "none"
                                             }}/>

                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        );
    }
}

export default StudentList;