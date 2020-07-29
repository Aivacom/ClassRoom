import React from 'react'
import Select from "react-select"
import {LanguageTypes, RoleTypes, RoomTypes, getText} from "../common/common";
import LocaleFactory from "../locale/LocaleFactory";
import LogoImage from "./LogoImage";
import renderUtils from "../common/RenderUtils"
import AppConstant from "../common/AppConstant"

class RoomSetting extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lang: props.language ? props.language : new LocaleFactory().load(),
            selectLanguage: {value: LanguageTypes[0].id, label: LanguageTypes[0].name},
            appId: props.appId,
            roomId: props.roomId,
            userName: props.userName,

            boardUuid: props.boardUuid,

            enterRoomHandler: props.enterRoomHandler,
            messageHandler: props.messageHandler,

            joinBtnDisabled: false,
            isTeacherNameChanged: false
        };

        this.state.userName = this.state.lang.Nickname;
    }

    componentDidMount() {
    }

    doEnterRoom() {
        if (isNaN(Number(this.state.roomId))) {
            this.state.messageHandler(this.state.lang.roomSettingErrInvalidRoomId);
            return;
        }

        if (this.state.roomId.startsWith('0')) {
            this.state.messageHandler(this.state.lang.roomSettingErrInvalidRoomIdZero);
            return;
        }

        if (this.state.roomId.length < 4 || this.state.roomId.length > 8) {
            this.state.messageHandler(this.state.lang.roomSettingRoomIdPlaceHolder);
            return;
        }

        if (!this.state.roomId) {
            this.state.messageHandler(this.state.lang.roomSettingErrNoRoomId);
            return;
        }

        if (!this.state.userName) {
            this.state.messageHandler(this.state.lang.roomSettingErrNoTeacherName);
            return;
        }

        if (this.state.joinBtnDisabled) {
            return;
        }

        if (!this.state.enterRoomHandler) {
            return;
        }
        let arg = {
            appId: this.state.appId,
            roomId: this.state.roomId,
            userName: this.state.userName,
            language: this.state.lang,
            boardUuid: this.state.boardUuid
        };

        this.state.enterRoomHandler(arg);
    }

    handleTeacherNameChanged(newName) {
        this.state.userName = newName;
        this.state.isTeacherNameChanged = true;

        this.setState(this.state);
    }

    onLanguageChanged(e) {
        this.state.lang = new LocaleFactory().load(e.value);

        if (!this.state.isTeacherNameChanged) {
            this.state.userName = this.state.lang.Nickname;
        }
        this.state.selectLanguage = e;
        this.props.onLanguageChanged(e);
        this.setState(this.state);

    };

    render() {
        return (
            <div>
                <div id='dialogRoomParameters' className='dialog-content roomParameterBG'
                     style={{
                         display: this.props.visible ? 'flex' : 'none',
                         zIndex: this.props.zIndex == null ? 0 : this.props.zIndex,
                         justifyContent: "space-between",
                         flexDirection: "column"
                     }}>
                    <div style={{
                        backgroundColor: 'white',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            margin: '0 0 0 15px',
                            alignSelf: "center"
                        }}>
                            <LogoImage height='24px' src="images/logo/login_logo.png"></LogoImage>
                        </div>
                        <div style={{
                            height: "fit-content",
                            alignSelf: "center",
                            marginRight: "15px"
                        }}>
                            <Select className="selectCommon Select" isSearchable={false}
                                    arrowRenderer={<div className="selectRoomSetting"></div>}
                                    onChange={this.onLanguageChanged.bind(this)}
                                    styles={{
                                        control: styles => ({
                                            ...styles,
                                            backgroundColor: "rgba(231, 248, 246, 1)",
                                            color: "rgba(0, 193, 170, 1)"
                                        }),
                                        singleValue: (styles, {data}) => ({
                                            ...styles,
                                            color: "rgba(0, 193, 170, 1)",
                                            alignSelf: "center"
                                        }),
                                        valueContainer: (base) => ({
                                            ...base,
                                            justifyContent: "center",
                                            height: "36px"
                                        }),
                                        menuList: styles => ({...styles, paddingTop: 0, paddingBottom: 0}),
                                        option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                                            return {
                                                ...styles,
                                                backgroundColor: "white",
                                                color: "black",
                                                borderRadius: '4px',
                                                cursor: isDisabled ? 'not-allowed' : 'default',
                                                ':active': {
                                                    ...styles[':active'],
                                                    backgroundColor: "rgba(231, 248, 246, 1)",
                                                    color: "rgba(0, 193, 170, 1)",
                                                },
                                            };
                                        }
                                    }}
                                    value={this.state.selectLanguage}
                                    options={LanguageTypes.map((rt) => {
                                        return {value: rt.id, label: rt.name}
                                    })}>

                            </Select>
                        </div>

                        <select id='languageChoose' className="selectCommon selectLanguage"
                                style={{
                                    display: "none",
                                    alignSelf: 'baseline'
                                }}
                                onChange={this.onLanguageChanged.bind(this)}>
                            {LanguageTypes.map((lang, index) => (
                                <option key={'LanguageTypes-' + lang.id}
                                        value={lang.id}>{lang.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="dialog-inner" style={{
                        height: 'fit-content',
                        display: 'flex',
                        width: 'fit-content',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        backgroundColor: 'transparent'
                    }}>
                        <div style={{
                            width: '345px',
                            position: 'relative'
                        }}>
                            <p style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                fontSize: '26px',
                                fontFamily: 'PingFangSC-Medium,PingFang SC',
                                fontWeight: '500',
                                color: 'rgba(51,51,51,1)',
                                lineHeight: '28px'
                            }}>{this.state.lang.roomSettingAppName}</p>

                            <div style={{
                                height: '28px'
                            }}></div>

                            <div style={{
                                display: 'flex',
                                width: "100%",
                                flexDirection: 'row-reverse',
                            }}>
                                <img style={{
                                    height: 'auto',
                                    maxWidth: '100%'
                                }} src={renderUtils.getImage("/images/login/person.png")}/>

                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    alignSelf: 'flex-end',
                                    flex: 1,
                                    flexDirection: 'column'
                                }}>
                                    <p style={{
                                        height: '17px',
                                        fontSize: '14px',
                                        fontFamily: 'BarlowSemiCondensed-SemiBold,BarlowSemiCondensed',
                                        fontWeight: '600',
                                        color: 'rgba(0,185,157,1)',
                                        lineHeight: '17px',
                                        marginTop: '7px'
                                    }}>V{AppConstant.AppVersion}</p>
                                    <p style={{
                                        width: '151px',
                                        fontSize: '14px',
                                        fontFamily: 'BarlowSemiCondensed-SemiBold,BarlowSemiCondensed',
                                        fontWeight: '600',
                                        color: 'rgba(102,102,102,1)',
                                        lineHeight: '17px'
                                    }}>
                                        TB: {AppConstant.ThunderBoltVersion} <br/>
                                        HMR: {AppConstant.HummerVersion}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="roomSettingFields" style={{
                            height: 'fit-content',
                            position: "releative"
                        }}>
                            <div>
                                <div className='roomSettingField' style={{display: 'none'}}>
                                    <p style={{display: 'inline-block'}}>{this.state.lang.roomSettingAppId}</p>
                                    <input onChange={e => this.setState({appId: e.currentTarget.value})}
                                           value={this.state.appId}
                                           className="input inputRoomSetting inputDebug" type="text"
                                           placeholder={this.state.lang.roomSettingAppIdPlaceHolder}/>
                                </div>
                                <div className='roomSettingField' style={{display: 'none'}}>
                                    <p style={{display: 'inline-block'}}>房间UUID：</p>
                                    <input onChange={e => this.setState({boardUuid: e.currentTarget.value})}
                                           value={this.state.boardUuid}
                                           className="input inputRoomSetting inputDebug" type="text"
                                           placeholder="白板房间，留空会再次创建"/>
                                </div>
                                <div className='roomSettingField'>
                                    <p>{this.state.lang.roomSettingRoomId}</p>
                                    <input onChange={e => this.setState({roomId: e.currentTarget.value})}
                                           value={this.state.roomId}
                                           className="input inputRoomSetting" type="number"
                                           placeholder={this.state.lang.roomSettingRoomIdPlaceHolder}/>
                                </div>
                                <div className='roomSettingField'>
                                    <p>{this.state.lang.roomSettingTeacherName}</p>
                                    <input
                                        onChange={e => this.handleTeacherNameChanged(e.currentTarget.value)}
                                        value={this.state.userName}
                                        readOnly={true}
                                        className="input inputRoomSetting" type="text"
                                        placeholder={this.state.lang.roomSettingTeacherNamePlaceHolder}/>
                                </div>
                                <div className='roomSettingField'>
                                    <p>{this.state.lang.roomSettingRoomType}</p>

                                    <Select className="selectCommon selectRoomSetting Select" isSearchable={false} arrowRenderer={<div className="selectRoomSetting"></div>}
                                            styles={{

                                                control: styles => ({ ...styles, backgroundColor: "rgba(231, 248, 246, 1)", color: "rgba(0, 193, 170, 1)"}),
                                                singleValue: (styles, { data }) => ({ ...styles, color: "rgba(0, 193, 170, 1)", alignSelf: "center" }),
                                                valueContainer: (base) => ({
                                                    ...base,
                                                    justifyContent: "center",
                                                    height: "40px"
                                                }),
                                                // menu: styles => ({...styles, paddingTop: 0, paddingBottom: 0}),
                                                menuList: styles => ({...styles, paddingTop: 0, paddingBottom: 0}),
                                                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                                    return {
                                                        ...styles,
                                                        backgroundColor: "rgba(231, 248, 246, 1)",
                                                        color: "rgba(0, 193, 170, 1)",
                                                        borderRadius: '6px',
                                                        // cursor: isDisabled ? 'not-allowed' : 'default',
                                                        ':active': {
                                                            ...styles[':active'],
                                                            backgroundColor: !isDisabled && (isSelected ? "rgba(231, 248, 246, 1)" : "white"),
                                                        },
                                                    };
                                                }
                                            }}
                                            value={{ value: getText(this.state, 'RoomTypes')[0].id, label: getText(this.state, 'RoomTypes')[0].name }}
                                            options={getText(this.state, 'RoomTypes').map((rt) => {
                                        return { value: rt.id, label: rt.name }
                                    })}>

                                    </Select>
                                </div>
                                <div className='roomSettingField'>
                                    <p>{this.state.lang.roomSettingRole}</p>
                                    <Select className="selectCommon selectRoomSetting Select" isSearchable={false} arrowRenderer={<div className="selectRoomSetting"></div>}
                                            styles={{

                                                control: styles => ({ ...styles, backgroundColor: "rgba(231, 248, 246, 1)", color: "rgba(0, 193, 170, 1)"}),
                                                singleValue: (styles, { data }) => ({ ...styles, color: "rgba(0, 193, 170, 1)", alignSelf: "center" }),
                                                valueContainer: (base) => ({
                                                    ...base,
                                                    justifyContent: "center",
                                                    height: "40px"
                                                }),
                                                // menu: styles => ({...styles, paddingTop: 0, paddingBottom: 0}),
                                                menuList: styles => ({...styles, paddingTop: 0, paddingBottom: 0}),
                                                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                                    return {
                                                        ...styles,
                                                        backgroundColor: "rgba(231, 248, 246, 1)",
                                                        color: "rgba(0, 193, 170, 1)",
                                                        borderRadius: '6px',
                                                        // cursor: isDisabled ? 'not-allowed' : 'default',
                                                        ':active': {
                                                            ...styles[':active'],
                                                            backgroundColor: !isDisabled && (isSelected ? "rgba(231, 248, 246, 1)" : "white"),
                                                        },
                                                    };
                                                }
                                            }}
                                            value={{ value: getText(this.state, 'RoleTypes')[0].id, label: getText(this.state, 'RoleTypes')[0].name }}
                                            options={getText(this.state, 'RoleTypes').map((rt) => {
                                                return { value: rt.id, label: rt.name }
                                            })}>

                                    </Select>
                                </div>
                                <a className="roomSettingField buttonCommon roomConfirm"
                                   style={{
                                       marginBottom: "32px"
                                   }}
                                   disabled={this.state.joinBtnDisabled}
                                   onClick={this.doEnterRoom.bind(this)}
                                >{this.state.lang.roomSettingEnter}</a>
                                <p style={{width: '300px', marginLeft: '23px'}}>{this.props.joinStatusTip}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        justifyItems: "center"

                    }}>
                        <p style={{
                            alignSelf: "center",
                            fontFamily: 'PingFangSC-Medium,PingFang SC',
                            fontWeight: '500',
                            color: 'rgba(51,51,51,1)',
                        }}>{this.state.lang.roomSettingAppName + " V"+ AppConstant.AppVersion}</p>
                        <p style={{
                            alignSelf: "center",
                            fontFamily: 'PingFangSC-Medium,PingFang SC',
                            fontWeight: '500',
                            color: 'rgba(51,51,51,1)',
                        }}></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoomSetting;
