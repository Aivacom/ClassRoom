import React from "react"
import LocaleFactory from "../locale/LocaleFactory";
import List from "@material-ui/core/List"
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { withStyles } from '@material-ui/styles'
import {PropTypes} from "prop-types"
import renderUtils from "../common/RenderUtils";

const useStyles = (theme) => ({
    root: {
        right: '-17px',
        left: '3px',
        top: '40px',
        overflowX: 'hidden',
        bottom: '0px',
        overflowY: 'scroll',
        position: 'absolute'
    },
    items: {
        width: '300px',
        height: '210px',
        borderRadius: '1px',
    },
    media: {
        marginTop: '5px',
        width: '300px',
        height: '210px',
    }

});



class RenderRow extends React.Component{

    constructor(props) {
        super(props);
    }

    index = 0;

    onItemClick(room, url, index) {
        console.log("item Clicked " + url);
        this.props.onCourseWareItemClick(room, url, index);
        this.index = index;
    }

    setupDivRef = (ref) => {
        if (ref) {
            if (this.props.room) {
                this.props.room.sceneState
                this.props.room.scenePreview(this.props.room.state.sceneState.scenePath, ref, 300, 210);
            }
        }
    };

    render() {
        const {root} = this.props;
        return (<List component="nav" className={root} aria-label="main mailbox folders">
            {this.props.images ? this.props.images.map((image, index) => {
                return <Card key={index} className={this.props.media}>
                    <CardActionArea>
                        <CardMedia onClick={this.onItemClick.bind(this, this.props.room, image.url, index)}
                                   className={this.props.media}
                                   image={`${image.thumbUrl}`}/>
                                   <div
                                   style={{
                                       width: '100%',
                                       marginTop: '-45px',
                                       height: '45px',
                                       background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%)',
                                       borderRadius: '3px'
                                   }}>
                                       <p style={{
                                           marginTop: this.index == index? "12px": '16px',
                                           marginLeft: '12px',
                                           height: '22px',
                                           fontSize: '16px',
                                           fontFamily: 'PingFangSC-Regular,PingFang SC',
                                           fontWeight: 400,
                                           color: 'rgba(255,255,255,1)',
                                           lineHeight: '22px'
                                       }}>P{index + 1}</p>

                                       <div style={{
                                           display: this.index == index ? "" : "none",
                                           width: '100%',
                                           height: '7px',
                                           background: 'rgba(49,182,158,1)'
                                       }}
                                       ></div>
                                   </div>
                    </CardActionArea>
                </Card>
            }) : null}
        </List>)
    }
}

class CoursewareList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lang: this.props.language ? this.props.language : new LocaleFactory().load()
        };
    }

    toggleMusic() {
        let isPlaying = !this.props.isPlaying;
        this.props.playMusic(isPlaying);
    }

    render() {
        const { classes } = this.props;
        const {language} = this.props;
        return (
            <div style={{
                display: this.props.visible ? "flex" : "none",
                height: window.innerHeight - 60 - 161 - 50,
                overflow: 'hidden',
                width: '307px'
            }}>
                <div style={{
                    width: '100%',
                    height: '40px',
                    fontSize: '16px',
                    fontFamily: 'PingFangSC-Regular,PingFang SC',
                    fontWeight: 400,
                    color: 'rgba(70,150,136,1)',
                    lineHeight: '22px',
                    display: 'flex',
                    justifyContent: "space-between",
                    flexDirection: 'row',
                    alignItems: "center"
                }}>
                    <p style={{
                        marginLeft: '8px',
                        fontSize: '16px',
                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                        fontWeight: 400,
                        color: 'rgba(70,150,136,1)',
                        lineHeight: '22px'
                    }}>{language.WakeUpMusic}</p>

                    <img src={this.props.isPlaying? renderUtils.getImage("/images/whiteboardtools/music_stop.png"):renderUtils.getImage("/images/whiteboardtools/music_start.png")}
                         onClick={this.toggleMusic.bind(this)}
                         style={{
                             width: '20px',
                             height: '20px',
                             marginRight: '14px'
                         }}/>
                </div>
                <RenderRow onCourseWareItemClick={this.props.onCourseWareItemClick} room={this.props.room}
                           images={this.props.images} media={classes.media} root={classes.root}/>
            </div>
        );
    }
}

CoursewareList.propTypes = {
    classes: PropTypes.object.isRequired,
    language: PropTypes.object.isRequired
};

export default withStyles(useStyles)(CoursewareList)
