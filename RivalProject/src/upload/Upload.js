import React, { Component } from 'react';
import '../styles/upload.css';
import Dropzone from '../dropzone/Dropzone';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      uploadProgress: {}
    };
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  async uploadFiles(files) {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({ uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ uploading: false });
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("image", file, file.name);

      req.onreadystatechange = () => {
        if (req.readyState == 4 && this.props.onUpload) {
          let err = req.status == 200 ? null : {
            status: req.status,
            message: req.statusText
          }
          const res = err ? req.responseText : JSON.parse(req.responseText);
          this.props.onUpload(err, res);
        }
      };
      req.open("POST", "api/images");
      req.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'))
      req.send(formData);
    });
  }

  render() {
    return (
      <div className="Upload">
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.uploadFiles}
              disabled={this.state.uploading}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Upload;