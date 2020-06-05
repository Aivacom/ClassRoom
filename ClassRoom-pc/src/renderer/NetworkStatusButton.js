import React from "react"
import renderUtils from "../common/RenderUtils"

class NetworkStatusButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <img alt=''
                 src={renderUtils.getImage((this.props.isUser ? "/images/network/quality_user_" : "/images/network/quality_") + this.props.ImageIndex + ".png")}
                 className="netWorkStatus"
                 disabled={this.props.isUser}
            />
        );
    }

}

export default NetworkStatusButton;