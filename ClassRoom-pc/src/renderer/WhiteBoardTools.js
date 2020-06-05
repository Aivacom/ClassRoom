import React, {useRef} from "react"
import renderUtils from "../common/RenderUtils"
import {RoomWhiteboard} from "white-react-sdk";
import { SketchPicker, RGBColor } from 'react-color';

class WhiteBoardTools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            syncDuration: 200,
            dividingRule: Object.freeze(
                [
                    0.10737418240000011,
                    0.13421772800000012,
                    0.16777216000000014,
                    0.20971520000000016,
                    0.26214400000000015,
                    0.3276800000000002,
                    0.4096000000000002,
                    0.5120000000000001,
                    0.6400000000000001,
                    0.8,
                    1,
                    1.26,
                    1.5876000000000001,
                    2.000376,
                    2.5204737600000002,
                    3.1757969376000004,
                    4.001504141376,
                    5.041895218133761,
                    6.352787974848539,
                    8.00451284830916,
                    10,
                ]),
            tempRuleIndex: 0,
            syncRuleIndexTimer: null,
            handToolActive: false,
            isShowColorPicker: false,
            strokeColor: {
                r: 255,
                g: 120,
                b: 0,
            }
        }

        if (props.room) {
            let color = props.room.memberState.strokeColor;
            this.state.strokeColor = {
                r: color[0],
                g: color[1],
                b: color[2],
            }
        }
    }

    setMemberState = (modifyState) => {
        this.props.room.setMemberState(modifyState);
    };

    moveRuleIndex(deltaIndex) {
        if (this.tempRuleIndex === undefined) {
            this.tempRuleIndex = this.readRuleIndexByScale(this.props.zoomNumber);
        }
        this.tempRuleIndex += deltaIndex;

        if (this.tempRuleIndex > this.state.dividingRule.length - 1) {
            this.tempRuleIndex = this.state.dividingRule.length - 1;

        } else if (this.tempRuleIndex < 0) {
            this.tempRuleIndex = 0;
        }
        const targetScale = this.state.dividingRule[this.tempRuleIndex];

        this.delaySyncRuleIndex();
        this.props.zoomChange(targetScale);
        // this.props.room.zoomChange(targetScale);
        console.log(targetScale)
    }

    delaySyncRuleIndex() {
        if (this.state.syncRuleIndexTimer !== null) {
            clearTimeout(this.syncRuleIndexTimer);
            this.syncRuleIndexTimer = null;
        }
        this.syncRuleIndexTimer = setTimeout(() => {
            this.syncRuleIndexTimer = null;
            this.tempRuleIndex = undefined;

        }, this.state.syncDuration);
    }

    readRuleIndexByScale(scale) {
        const dividingRule = this.state.dividingRule;

        if (scale < dividingRule[0]) {
            return 0;
        }
        for (let i = 0; i < dividingRule.length; ++i) {
            const prePoint = dividingRule[i - 1];
            const point = dividingRule[i];
            const nextPoint = dividingRule[i + 1];

            const begin = prePoint === undefined ? Number.MIN_SAFE_INTEGER : (prePoint + point) / 2;
            const end = nextPoint === undefined ? Number.MAX_SAFE_INTEGER : (nextPoint + point) / 2;

            if (scale >= begin && scale <= end) {
                return i;
            }
        }
        return dividingRule.length - 1;
    }

    clickAppliance(applianceName) {
        if ("color_picker" == applianceName) {
            let result = this.state.isShowColorPicker;
            this.setState({isShowColorPicker: !result});
            return;
        } else if ("move" == applianceName) {
            //主动激活
            this.props.room.handToolActive = true;
            this.props.room.setMemberState({currentApplianceName: "selector"});
            if (this.props.roomState.course) {
                this.props.roomState.course.lockBoard;
            }
            this.setState({handToolActive: true});
            this.setState({isShowColorPicker: false});
            return;
        } else if ("newPage" == applianceName) {
            if (this.props.PPTMode) {
                return;
            }

            if (this.props.roomState && this.props.roomState.sceneState) {
                const newSceneIndex = this.props.roomState.sceneState.index;
                const scenePath = this.props.roomState.sceneState.scenePath;
                const pathName = this.pathName(scenePath);
                console.log("白板增加一页By roomState pathName：" + pathName);
                this.props.room.putScenes(`/${pathName}`, [{}], newSceneIndex);
                this.props.room.setSceneIndex(newSceneIndex);
                console.log("白板增加一页By roomState");
            } else if (this.props.room && this.props.room.roomState && this.props.room.roomState.sceneState) {
                const newSceneIndex = this.props.room.roomState.sceneState.index;
                const scenePath = this.props.room.roomState.sceneState.scenePath;
                const pathName = this.pathName(scenePath);
                console.log("白板增加一页By room pathName：" + pathName);
                this.props.room.putScenes(`/${pathName}`, [{}], newSceneIndex);
                this.props.room.setSceneIndex(newSceneIndex);
                console.log("白板增加一页By room");
            } else {
                console.log("白板增加一页失败！！");
            }
            this.setState({isShowColorPicker: false});
            return;
        } else if ("uploadPPT" == applianceName) {
            this.setState({isShowColorPicker: false});
            return;
        }
        this.setState({isShowColorPicker: false});
        this.setState({handToolActive: false});
        this.props.room.handToolActive = false;
        console.log(applianceName);
        this.props.setMemberState(applianceName)
    }

    pathName = (path) => {
        const reg = /\/([^\/]*)\//g;
        reg.exec(path);
        if (RegExp.$1 === "aria") {
            return "";
        } else {
            return RegExp.$1;
        }
    };

    setSceneIndex(index) {
        if (this.props.roomState && this.props.roomState.sceneState) {
            const scenes = this.props.roomState.sceneState.scenes;
            if (index >= scenes.length || index < 0) {
                return;
            }
        }

        if (this.props.room) {
            this.props.room.setSceneIndex(index);
        }
    }

    onColorChanged(color) {
        if (!this.props.room) return;
        const {rgb} = color;
        const {r, g, b} = rgb;
        this.setState({strokeColor: {r: r, g: g, b: b}});
        this.props.room.setMemberState({
            strokeColor: [r, g, b],
        });
    }

    domRef = (domRef) => {
        if (!this.props.room) return;
        this.props.room.bindHtmlElement(domRef);
    }

    render() {
        return <div style={{
            position: 'relative',
            userSelect: 'none',
            height: window.innerHeight - 60,
            width: '100%',
            maxHeight: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div ref={this.domRef} className="whiteboard-container" style={{
                width: '100%',
                height: '100%',
                display: (this.props.isClassBegin === true) ? "" : "none"
            }}>
                {
                    this.props.room?
                        <RoomWhiteboard id='boardContentRoom'
                                        style={{
                                            background: 'rgba(255,255,255,1)',
                                            width: '100%',
                                            height: "100vh"
                                        }}
                                        className="whiteboard" room={this.props.room}/> : null
                }
            </div>

            <div
                id="WhiteBoardToolsMsg"
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
                    id="WhiteBoardToolsMsgContnt"
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

            <div
                style={{
                    width: 'fit-content',
                    height: 'auto',
                    background: 'rgba(32,42,41,1)',
                    borderRadius: '6px',
                    display: (this.props.joinedRoom === true && this.props.isBoardJoined === true && this.props.isClassBegin === true) ? "flex" : "none",
                    zIndex: '41',
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    flexDirection: 'column'
                }}>
                <img className="whiteBoardToolsCommon" onClick={() => this.clickAppliance("selector")}
                     disabled={"selector" == this.props.currentApplianceName && !this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_selector.png")}/>
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("pencil")}
                     disabled={"pencil" == this.props.currentApplianceName && !this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_pen.png")}/>
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("rectangle")}
                     disabled={"rectangle" == this.props.currentApplianceName && !this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_rect.png")}/>
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("ellipse")}
                     disabled={"ellipse" == this.props.currentApplianceName && !this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_cycle.png")}/>
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("text")}
                     disabled={"text" == this.props.currentApplianceName && !this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_font.png")}/>
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("eraser")}
                     disabled={"eraser" == this.props.currentApplianceName && !this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_earser.png")}/>
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("color_picker")}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_color.png")}/>
                <img className="whiteBoardToolsCommon" style={{
                    display: this.props.PPTMode ? "none" : ""
                }} onClick={() =>this.clickAppliance("newPage")}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_new_page.png")}/>
                {/*<img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("uploadPPT")}*/}
                {/*     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_upload_ppt.png")}/>*/}
                <img className="whiteBoardToolsCommon" onClick={() =>this.clickAppliance("move")}
                     disabled={this.state.handToolActive}
                     src={renderUtils.getImage("/images/whiteboardtools/white_board_tool_move.png")}/>

            </div>

            <div style={{
                display: (this.props.joinedRoom === true && this.props.isBoardJoined === true && this.props.isClassBegin === true && this.state.isShowColorPicker === true) ? "" : "none",
                position: 'absolute',
                top: "100px",
                left: "70px",
                zIndex: 41
            }}>
                <SketchPicker color={this.state.strokeColor}
                              onChangeComplete={this.onColorChanged.bind(this)}/>
            </div>

            <div style={{
                display: (this.props.joinedRoom === true && this.props.isBoardJoined === true && this.props.isClassBegin === true) ? "flex" : "none",
                width: 'fit-content',
                height: '40px',
                justifyContent: 'space-evenly',
                background: 'rgba(255,255,255,1)',
                borderRadius: '6px',
                'position': 'absolute',
                bottom: '10px',
                zIndex: '101',
                left: '15px',
                border: '1px solid rgba(224,224,224,1)'
            }}>
                <img className="whiteBoardBottomButtonCommon" style={{
                    alignSelf: 'center',
                    margin: '0 4px 0 4px'
                }
                } src={renderUtils.getImage("/images/whiteboardtools/white_page_min.png")}
                    onClick={()=> this.moveRuleIndex(-1)}
                />
                <p className="whiteBoardBottomTextCommon" style={{
                    margin: '0 0 0 0'
                }}>{Math.ceil(this.props.zoomNumber * 100)}%</p>
                <img className="whiteBoardBottomButtonCommon" style={{
                    alignSelf: 'center',
                    margin: '0 4px 0 4px'
                }} src={renderUtils.getImage("/images/whiteboardtools/white_page_plus.png")}
                     onClick={() => this.moveRuleIndex(+1)}
                />
            </div>

            <div
                style={{
                    display: (this.props.joinedRoom === true && this.props.isBoardJoined === true && this.props.isClassBegin === true) ? "flex" : "none",
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    'position': 'absolute',
                    bottom: '10px',
                    right: '19px',
                    zIndex: '101',
                }}>
                <div
                    style={{
                        width: 'fit-content',
                        display: this.props.PPTMode ? 'none' : 'flex',
                        flexDirection: 'row',
                        margin: '0 19px 0 0',
                        justifyContent: 'space-evenly',
                        background: 'rgba(255,255,255,1)',
                        borderRadius: '6px',
                        border: '1px solid rgba(224,224,224,1)'
                    }}>
                    <img className="whiteBoardBottomButtonCommon" style={{

                        alignSelf: 'center',
                        margin: '4px 2px 4px 5px'
                    }}
                         onClick={() => this.setSceneIndex(0)}
                         src={renderUtils.getImage("/images/whiteboardtools/page_first.png")}/>
                    <img className="whiteBoardBottomButtonCommon" style={{
                        alignSelf: 'center',
                        margin: '4px 4px 4px 2px'
                    }} onClick={() => this.setSceneIndex((this.props.roomState && this.props.roomState.sceneState) ? this.props.roomState.sceneState.index - 1 : 0 )}
                         disabled={(this.props.roomState && this.props.roomState.sceneState) ? this.props.roomState.sceneState.index == 0 : false}
                         src={renderUtils.getImage("/images/whiteboardtools/page_previous.png")}/>
                    <div style={{
                        background: 'rgba(245,245,245,1)',
                        borderRadius: '6px',
                        alignSelf: 'center'
                    }}>
                        <p className="whiteBoardBottomTextCommon" style={{
                            margin: "7px 18px 5px 16px",
                            height: '20px'
                        }}>{(this.props.roomState == null || this.props.roomState.sceneState == null) ? 1 : (this.props.roomState.sceneState.index + 1)} / {(this.props.roomState == null || this.props.roomState.sceneState == null) ? 1 : this.props.roomState.sceneState.scenes.length}</p>

                    </div>
                    <img className="whiteBoardBottomButtonCommon" style={{
                        alignSelf: 'center',
                        margin: '4px 2px 4px 4px'
                    }} onClick={() => this.setSceneIndex((this.props.roomState && this.props.roomState.sceneState) ? this.props.roomState.sceneState.index + 1 : 0 )}
                         disabled={(this.props.roomState && this.props.roomState.sceneState) ? this.props.roomState.sceneState.scenes.length - 1 == this.props.roomState.sceneState.index : false}
                         src={renderUtils.getImage("/images/whiteboardtools/page_next.png")}/>
                    <img className="whiteBoardBottomButtonCommon" style={{
                        alignSelf: 'center',
                        margin: '4px 3px 4px 2px'
                    }} onClick={() => this.setSceneIndex((this.props.roomState && this.props.roomState.sceneState) ? this.props.roomState.sceneState.scenes.length -1 : 0 )}
                         src={renderUtils.getImage("/images/whiteboardtools/page_latest.png")}/>
                </div>

                <img disabled={this.props.isClassBegin == false}
                     className={this.props.PPTMode ? "whiteBoardBottomButtonCommon whiteBoardWhiteBoardButton" : "whiteBoardBottomButtonCommon whiteBoardPPTBoardButton"}
                     style={{
                         width: '41px',
                         height: '40px',
                         alignSelf: 'center',
                         margin: '0 19px 0 0',

                     }} onClick={this.props.togglePPT.bind(this)}/>

                <img disabled={this.props.isClassBegin == false}
                     className={this.props.isHandOn ? "whiteBoardBottomButtonCommon whiteBoardHandsOffButton" : "whiteBoardBottomButtonCommon whiteBoardHandsUpButton"}
                     style={{
                         display: (this.props.talkingUserId || this.props.connectingUserId)? 'none': '',
                         width: '41px',
                         height: '40px',
                         alignSelf: 'center',
                         margin: '0 19px 0 0',

                     }} onClick={this.props.toggleHand.bind(this)}/>

                <img disabled={true}
                    className="whiteBoardBottomButtonCommon whiteBoardShateButton" style={{
                    width: '41px',
                    height: '40px',
                    alignSelf: 'center',
                    margin: '0 0 0 0'
                }}/>
            </div>
        </div>
    }
}

export default WhiteBoardTools