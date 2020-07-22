import React, { Component } from "react";
import Quagga from "quagga";
import "./barcodescanner.css";

class Scanner extends Component {
  componentDidMount() {
    Quagga.init(
      {
        numOfWorkers: 0,
        locate: true,
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment", // or user
          },
        },
        decoder: {
          readers: ["code_128_reader"],
        },
        locator: {
          halfSample: true,
          patchSize: "medium",
        },
      },
      function (err) {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
  }

  _onDetected = (result) => {
    this.props.onDetected(result);
  };

  render() {
    return (
      <div id="interactive" className="viewport">
        <video></video>
        <canvas className="drawingBuffer"></canvas>
        <br clear="all" />
        <div className="barcodeHorizontalBar"></div>
      </div>
    );
  }
}

export default Scanner;
