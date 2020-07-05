import React from "react";
import Reader from 'react-qr-reader'

export default class Layout extends React.Component{
	constructor(props) {
    super(props);
    this.state = { facingMode: "environment", delay: 500, on: true };
	}

	handleScan = data => {
    if (data) {
			this.props.scanComplete(data);
      this.setState({
        result: data
      })
    }
  }
  handleError = err => {
    console.error(err)
	}

  render() {
    const { selectFacingMode, selectDelay, legacyMode, onAndOff } = this.props;

    return (
      <div style={{ width: "400px", margin: "auto" }}>
        {this.state.on && (
          <Reader
            onError={this.handleError}
            onScan={this.handleScan}
            ref="reader"
            facingMode={this.state.facingMode}
            legacyMode={legacyMode}
            maxImageSize={1000}
            delay={this.state.delay}
            className="reader-container"
          />
        )}
      </div>
    );
	}
}
