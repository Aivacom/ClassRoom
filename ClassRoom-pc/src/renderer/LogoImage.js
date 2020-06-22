import React from "react"
import renderUtils from '../common/RenderUtils'

const remote = require('electron').remote;

class LogoImage extends React.Component {

    constructor(props) {
        super(props);
    }

    handleDevToolsShow() {
        let win = remote.getCurrentWindow();
        win.webContents.openDevTools({mode: "bottom"});
    }

    render() {
        return (
            <div className='devTools'>
                <img alt='' src={renderUtils.getImage(this.props.src)}
                     onClick={this.handleDevToolsShow.bind(this)}

                     style={{
                         width: this.props.width ? this.props.width : 'auto',
                         height: this.props.height ? this.props.height : 'auto'
                     }}/>
            </div>
        );
    }

}

export default LogoImage;
